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
exports.raasAgentStartState = exports.raasAgent = exports.sm = exports.RaaSPorts = void 0;
const framework_1 = require("@sorrir/framework");
const fault_handler_1 = require("./fault-handler");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
// ✅ FSM States
var States;
(function (States) {
    States["ANALYZING"] = "ANALYZING";
    States["RECOVERING"] = "RECOVERING";
})(States || (States = {}));
// ✅ Ports
var RaaSPorts;
(function (RaaSPorts) {
    RaaSPorts["TO_FAULT_HANDLER"] = "TO_FAULT_HANDLER";
})(RaaSPorts || (exports.RaaSPorts = RaaSPorts = {}));
// ✅ Anomaly Detection Helper
function checkPythonAnomalyFlag() {
    try {
        const dataPath = path.resolve("data/outputs/anomaly.json");
        const jsonData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        return jsonData?.is_anomaly === true;
    }
    catch (e) {
        console.warn("⚠️ RaaS Agent: Failed to read anomaly.json. Assuming normal.");
        return false;
    }
}
// ✅ FSM Definition
exports.sm = {
    transitions: [
        {
            sourceState: States.ANALYZING,
            targetState: States.RECOVERING,
            action: (_, raiseEvent) => {
                if (checkPythonAnomalyFlag()) {
                    raiseEvent({
                        type: fault_handler_1.FaultHandlerEventTypes.FAULT,
                        port: RaaSPorts.TO_FAULT_HANDLER,
                        eventClass: "oneway"
                    });
                    console.warn("📡 RaaS Agent: Detected anomaly → FAULT raised");
                    try {
                        // Restart via WSL-compatible path
                        (0, child_process_1.execSync)("bash recover/restart_faulty.sh", {
                            cwd: path.resolve("faulty-app"),
                            stdio: "inherit"
                        });
                        console.log("✅ RaaS Agent: Faulty app restarted.");
                    }
                    catch (err) {
                        console.error("❌ RaaS Agent: Recovery script failed.");
                    }
                    fs.appendFileSync("data/outputs/recovery_attempt.log", `Edge recovery triggered at ${new Date().toISOString()}\n`);
                }
                else {
                    console.log("✅ RaaS Agent: No anomaly detected.");
                }
                return;
            },
        },
        {
            sourceState: States.RECOVERING,
            targetState: States.ANALYZING,
            action: () => {
                console.log("🔁 RaaS Agent: Returning to ANALYZING.");
            },
        },
    ],
};
// ✅ Component Export
exports.raasAgent = (0, framework_1.createStatemachineComponent)([
    {
        name: RaaSPorts.TO_FAULT_HANDLER,
        eventTypes: Object.values(fault_handler_1.FaultHandlerEventTypes),
        direction: "out",
    },
], exports.sm, "raas-agent");
// ✅ Initial State
exports.raasAgentStartState = {
    state: { fsm: States.ANALYZING, my: undefined },
    events: [],
    tsType: "State",
};
//# sourceMappingURL=raas-agent.js.map