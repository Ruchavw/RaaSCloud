"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideCStartState = exports.rideC = exports.sm = exports.RideCEventTypes = exports.RideCPorts = void 0;
// ride-c.ts
const framework_1 = require("@sorrir/framework");
var RideCPorts;
(function (RideCPorts) {
    RideCPorts["TO_RIDE_D"] = "TO_RIDE_D";
})(RideCPorts || (exports.RideCPorts = RideCPorts = {}));
var RideCEventTypes;
(function (RideCEventTypes) {
    RideCEventTypes["RECOVERY"] = "RECOVERY";
    RideCEventTypes["FAULT"] = "FAULT";
})(RideCEventTypes || (exports.RideCEventTypes = RideCEventTypes = {}));
var RideCStates;
(function (RideCStates) {
    RideCStates["MONITOR"] = "MONITOR";
    RideCStates["RECOVERING"] = "RECOVERING";
})(RideCStates || (RideCStates = {}));
const healthyPaths = new Set(["path-A", "path-B", "path-C"]);
exports.sm = {
    transitions: [
        {
            sourceState: RideCStates.MONITOR,
            targetState: RideCStates.RECOVERING,
            event: ["oneway", RideCEventTypes.FAULT, undefined],
            action: (my, raiseEvent) => {
                const goodPaths = Array.from(healthyPaths);
                raiseEvent({
                    type: RideCEventTypes.RECOVERY,
                    port: RideCPorts.TO_RIDE_D,
                    eventClass: "oneway",
                    payload: { suggestedPaths: goodPaths },
                });
                console.log("📡 RIDE-C: Suggested good paths →", goodPaths);
                console.log("🛠️ RIDE-C: Entered RECOVERING mode — smart casting paths...");
                return { paths: goodPaths };
            },
        },
        {
            sourceState: RideCStates.RECOVERING,
            targetState: RideCStates.MONITOR,
            // Passive reset after a cycle
        },
    ],
};
exports.rideC = (0, framework_1.createStatemachineComponent)([
    {
        name: RideCPorts.TO_RIDE_D,
        direction: "out",
        eventTypes: Object.values(RideCEventTypes),
    },
], exports.sm, "ride-c");
exports.rideCStartState = {
    state: { fsm: RideCStates.MONITOR, my: { paths: [] } },
    events: [],
    tsType: "State",
};
//# sourceMappingURL=ride-c.js.map