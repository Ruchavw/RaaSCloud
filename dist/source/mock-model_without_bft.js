"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.example_config = void 0;
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
// FSMs
const sensors = __importStar(require("./components/sensor"));
const fault_handler_1 = require("./components/fault-handler");
const raas_agent_1 = require("./components/raas-agent");
const ride_c_1 = require("./components/ride-c");
const ride_d_1 = require("./components/ride-d");
const core_app_1 = require("./core-app");
function runTransition(fsm, state, incomingEvents = []) {
    const raisedEvents = [];
    const transition = fsm.transitions.find((t) => {
        if (t.sourceState !== state.state.fsm)
            return false;
        if (t.event) {
            const [ec, etype, eport] = t.event;
            return incomingEvents.some((e) => e.eventClass === ec && e.type === etype && e.port === eport);
        }
        return t.condition ? t.condition(state.state.my) : true;
    });
    const newMy = transition?.action
        ? transition.action(state.state.my, (e) => raisedEvents.push(e), incomingEvents[0])
        : state.state.my;
    return {
        newState: {
            state: {
                fsm: transition ? transition.targetState : state.state.fsm,
                my: newMy,
            },
            events: raisedEvents,
            tsType: "State",
        },
        raisedEvents,
    };
}
const anomalyPath = "data/outputs/anomaly.json";
const fsmLogPath = "data/outputs/fsm_log.json";
const fsmLogFullPath = "data/outputs/fsm_log_full.json"; // <-- full log path
exports.example_config = {
    run: async () => {
        const sensorsArray = [
            { name: "cam-1", fsm: sensors.cam1Sensor, state: sensors.genericStartState() },
            { name: "cam-2", fsm: sensors.cam2Sensor, state: sensors.genericStartState() },
            { name: "cloud", fsm: sensors.cloudSensor, state: sensors.genericStartState() },
            { name: "fog-0", fsm: sensors.fog0Sensor, state: sensors.genericStartState() },
            { name: "irrigation-controller", fsm: sensors.irrigationSensor, state: sensors.genericStartState() },
            { name: "soil-sensor-node", fsm: sensors.soilSensor, state: sensors.genericStartState() },
            { name: "signal-monitor", fsm: sensors.signalMonitorSensor, state: sensors.genericStartState() },
        ];
        let faultHandlerState = fault_handler_1.faultHandlerStartState;
        let raasState = raas_agent_1.raasAgentStartState;
        let rideCState = ride_c_1.rideCStartState;
        let rideDState = ride_d_1.rideDStartState;
        const logs = [];
        let rideCRecoveryCycle = null;
        let rideDRecoveryCycle = null;
        while (!fs.existsSync(anomalyPath)) {
            console.log("⏳ Waiting for anomaly.json...");
            await new Promise((r) => setTimeout(r, 2000));
        }
        for (let i = 0; i < 20; i++) {
            console.log(`\n🔁 Cycle ${i + 1}`);
            (0, core_app_1.coreApplicationLogic)();
            let affectedDevices = [];
            try {
                const anomalyRaw = fs.readFileSync(anomalyPath, "utf-8");
                const anomaly = JSON.parse(anomalyRaw);
                if (anomaly?.is_anomaly) {
                    affectedDevices = Object.keys(anomaly.affected_devices);
                    console.log(`🚨 Anomalies found on devices: ${affectedDevices.join(", ")}`);
                }
            }
            catch (err) {
                console.warn("⚠️ Failed to read anomaly.json, continuing...");
            }
            const isAnomaly = affectedDevices.length > 0;
            sensorsArray.forEach((s) => {
                if (affectedDevices.includes(s.name))
                    s.state.state.my = -1;
                else if (s.state.state.my === -1)
                    s.state.state.my = 0;
            });
            sensorsArray.forEach((sensor) => {
                const result = runTransition(sensor.fsm.sm, sensor.state);
                sensor.state = result.newState;
                console.log(`📡 ${sensor.name} FSM: ${sensor.state.state.fsm}`);
            });
            const raasResult = runTransition(raas_agent_1.sm, raasState);
            raasState = raasResult.newState;
            faultHandlerState = runTransition(fault_handler_1.sm, faultHandlerState, raasResult.raisedEvents).newState;
            if (isAnomaly && rideCState.state.fsm === "MONITOR") {
                rideCState = runTransition(ride_c_1.sm, rideCState, [
                    { eventClass: "oneway", type: "FAULT", port: undefined },
                ]).newState;
                rideCRecoveryCycle = i;
            }
            else if (rideCRecoveryCycle !== null && i - rideCRecoveryCycle >= 2) {
                rideCState = runTransition(ride_c_1.sm, rideCState).newState;
                rideCRecoveryCycle = null;
            }
            const rideDResult = runTransition(ride_d_1.sm, rideDState, rideCState.events);
            rideDState = rideDResult.newState;
            if (rideDState.state.fsm === "REROUTING") {
                if (rideDRecoveryCycle === null)
                    rideDRecoveryCycle = i;
                else if (i - rideDRecoveryCycle >= 2) {
                    rideDState = runTransition(ride_d_1.sm, rideDState).newState;
                    rideDRecoveryCycle = null;
                }
            }
            logs.push({
                cycle: i + 1,
                sensors: sensorsArray.map((s) => `${s.name}:${s.state.state.fsm}`).join(" | "),
                raasEvents: raasResult.raisedEvents.map((e) => e.type),
                faultHandler: faultHandlerState.state.fsm,
                rideC: rideCState.state.fsm,
                rideD: rideDState.state.fsm,
            });
            fs.writeFileSync(fsmLogPath, JSON.stringify({
                ride_c_state: rideCState.state.fsm,
                ride_d_state: rideDState.state.fsm,
                recovery_triggered: rideCState.state.fsm === "RECOVERING" ? 1 : 0,
            }, null, 2));
            // ✅ Write full FSM log after each cycle
            fs.writeFileSync(fsmLogFullPath, JSON.stringify(logs, null, 2));
            console.log(`📡 RaaS Events: ${raasResult.raisedEvents.map((e) => e.type).join(", ") || "None"}`);
            console.log(`🛡️ FaultHandler FSM: ${faultHandlerState.state.fsm}`);
            console.log(`🛠️ RIDE-C FSM: ${rideCState.state.fsm}`);
            console.log(`🔁 RIDE-D FSM: ${rideDState.state.fsm}`);
            await new Promise((res) => setTimeout(res, 5000));
        }
        console.log("\n📋 Final Transition Table:");
        console.table(logs);
        (0, child_process_1.exec)("python visualizations/ride_fsm_plot.py", (err, stdout, stderr) => {
            if (err)
                console.error("❌ FSM plot error:", stderr);
            else
                console.log("✅ ride_fsm_plot.py executed.\n", stdout);
        });
        console.log("✅ Simulation finished.");
    }
};
if (require.main === module) {
    console.log("🚀 Starting mock-model simulation...");
    exports.example_config.run();
}
//# sourceMappingURL=mock-model_without_bft.js.map