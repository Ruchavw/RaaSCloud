"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rideDStartState = exports.rideD = exports.sm = exports.RideDPorts = void 0;
const framework_1 = require("@sorrir/framework");
var RideDStates;
(function (RideDStates) {
    RideDStates["FORWARDING"] = "FORWARDING";
    RideDStates["REROUTING"] = "REROUTING";
})(RideDStates || (RideDStates = {}));
var RideDPorts;
(function (RideDPorts) {
    RideDPorts["FINAL_OUTPUT"] = "FINAL_OUTPUT";
})(RideDPorts || (exports.RideDPorts = RideDPorts = {}));
exports.sm = {
    transitions: [
        {
            sourceState: RideDStates.FORWARDING,
            targetState: RideDStates.REROUTING,
            event: ["oneway", "RECOVERY", "TO_RIDE_D"],
            action: (my, _, event) => {
                const suggestedPaths = event?.payload?.suggestedPaths || [];
                const selectedPath = suggestedPaths.length > 0 ? suggestedPaths[0] : "fallback";
                console.log(`🚦 RIDE-D: Switching to path → ${selectedPath}`);
                return { currentPath: selectedPath };
            },
        },
        {
            sourceState: RideDStates.REROUTING,
            targetState: RideDStates.FORWARDING,
            action: (my) => {
                console.log(`📤 RIDE-D: Now forwarding via ${my?.currentPath}`);
                return my;
            },
        },
    ],
};
exports.rideD = (0, framework_1.createStatemachineComponent)([
    {
        name: RideDPorts.FINAL_OUTPUT,
        eventTypes: ["FORWARDED"],
        direction: "out",
    },
], exports.sm, "ride-d");
exports.rideDStartState = {
    state: { fsm: RideDStates.FORWARDING, my: { currentPath: null } },
    events: [],
    tsType: "State",
};
//# sourceMappingURL=ride-d.js.map