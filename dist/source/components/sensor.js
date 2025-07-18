"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genericStartState = exports.signalMonitorSensor = exports.soilSensor = exports.irrigationSensor = exports.fog0Sensor = exports.cloudSensor = exports.cam2Sensor = exports.cam1Sensor = exports.createSensorFSM = exports.GenericSensorStates = exports.GenericSensorPorts = exports.GenericSensorEventTypes = void 0;
const framework_1 = require("@sorrir/framework");
// Generic event types the sensors can emit
var GenericSensorEventTypes;
(function (GenericSensorEventTypes) {
    GenericSensorEventTypes["DETECTION"] = "DETECTION";
    GenericSensorEventTypes["NOTHING"] = "NOTHING";
    GenericSensorEventTypes["FAULT"] = "FAULT";
})(GenericSensorEventTypes || (exports.GenericSensorEventTypes = GenericSensorEventTypes = {}));
// Ports the sensor can communicate on
var GenericSensorPorts;
(function (GenericSensorPorts) {
    GenericSensorPorts["TO_DSB"] = "TO_DSB";
})(GenericSensorPorts || (exports.GenericSensorPorts = GenericSensorPorts = {}));
// FSM states for the sensors
var GenericSensorStates;
(function (GenericSensorStates) {
    GenericSensorStates["ACTIVE"] = "ACTIVE";
    GenericSensorStates["INACTIVE"] = "INACTIVE";
    GenericSensorStates["FAULTY"] = "FAULTY";
})(GenericSensorStates || (exports.GenericSensorStates = GenericSensorStates = {}));
// ✅ Factory function to create sensor FSM for any device
const createSensorFSM = (name) => {
    const fsm = {
        transitions: [
            {
                sourceState: GenericSensorStates.INACTIVE,
                targetState: GenericSensorStates.FAULTY,
                condition: (tick) => tick === -1,
                action: (tick, raiseEvent) => {
                    raiseEvent({
                        type: GenericSensorEventTypes.FAULT,
                        port: GenericSensorPorts.TO_DSB,
                        eventClass: "oneway",
                    });
                    return tick;
                },
            },
            {
                sourceState: GenericSensorStates.ACTIVE,
                targetState: GenericSensorStates.FAULTY,
                condition: (tick) => tick === -1,
                action: (tick, raiseEvent) => {
                    raiseEvent({
                        type: GenericSensorEventTypes.FAULT,
                        port: GenericSensorPorts.TO_DSB,
                        eventClass: "oneway",
                    });
                    return tick;
                },
            },
            {
                sourceState: GenericSensorStates.INACTIVE,
                targetState: GenericSensorStates.ACTIVE,
                action: (tick, raiseEvent) => {
                    raiseEvent({
                        type: GenericSensorEventTypes.DETECTION,
                        port: GenericSensorPorts.TO_DSB,
                        eventClass: "oneway",
                    });
                    return tick + 1;
                },
            },
            {
                sourceState: GenericSensorStates.ACTIVE,
                targetState: GenericSensorStates.ACTIVE,
                condition: (tick) => tick <= 3,
                action: (tick) => tick + 1,
            },
            {
                sourceState: GenericSensorStates.ACTIVE,
                targetState: GenericSensorStates.INACTIVE,
                condition: (tick) => tick > 3,
                action: (tick, raiseEvent) => {
                    raiseEvent({
                        type: GenericSensorEventTypes.NOTHING,
                        port: GenericSensorPorts.TO_DSB,
                        eventClass: "oneway",
                    });
                    return 0;
                },
            },
        ],
    };
    const component = (0, framework_1.createStatemachineComponent)([
        {
            name: GenericSensorPorts.TO_DSB,
            eventTypes: Object.values(GenericSensorEventTypes),
            direction: "out",
        },
    ], fsm, name);
    // ✅ Return both the component and FSM itself
    return { sm: fsm, ...component };
};
exports.createSensorFSM = createSensorFSM;
// ✅ Sensor Instances
exports.cam1Sensor = (0, exports.createSensorFSM)("cam-1");
exports.cam2Sensor = (0, exports.createSensorFSM)("cam-2");
exports.cloudSensor = (0, exports.createSensorFSM)("cloud");
exports.fog0Sensor = (0, exports.createSensorFSM)("fog-0");
exports.irrigationSensor = (0, exports.createSensorFSM)("irrigation-controller");
exports.soilSensor = (0, exports.createSensorFSM)("soil-sensor-node");
exports.signalMonitorSensor = (0, exports.createSensorFSM)("signal-monitor");
// ✅ Start states for each sensor
const genericStartState = (initial = GenericSensorStates.INACTIVE) => ({
    state: { fsm: initial, my: 0 },
    events: [],
    tsType: "State",
});
exports.genericStartState = genericStartState;
//# sourceMappingURL=sensor.js.map