"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventType = void 0;
exports.sendEvent = sendEvent;
exports.performCloudRecovery = performCloudRecovery;
const node_fetch_1 = __importDefault(require("node-fetch"));
const child_process_1 = require("child_process");
var EventType;
(function (EventType) {
    EventType["COMMAND"] = "COMMAND";
    EventType["EVENT"] = "EVENT";
    EventType["INTERNAL"] = "INTERNAL";
})(EventType || (exports.EventType = EventType = {}));
const CLOUD_ID = "cloud-coordinator";
// ✅ Send FSM event to HTTP endpoint
async function sendEvent(event) {
    const port = 1235; // Adjust if needed
    const url = `http://localhost:${port}/b/${event.receiver}/FROM_${event.sender}`;
    await (0, node_fetch_1.default)(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event })
    });
}
// ✅ Java-based BFT consensus invocation
function getBFTDecision(states) {
    const cmd = `java -cp bft/bin bftsmart.mvptools.recovery.BFTRecoveryDecision ${states.join(" ")}`;
    const output = (0, child_process_1.execSync)(cmd).toString().trim();
    return output === "RESET" ? "RESET" : "RECOVER";
}
// ✅ Recovery logic based on FSM state analysis
async function performCloudRecovery(sensorStates) {
    console.log("☁️ [Cloud] Invoking BFT Recovery using final sensor state...");
    const controlStates = sensorStates.map(s => s.controlState);
    const decision = getBFTDecision(controlStates);
    const event = {
        sender: CLOUD_ID,
        receiver: "system-coordinator",
        type: EventType.COMMAND,
        payload: decision,
        timestamp: Date.now()
    };
    await sendEvent(event);
    console.log(`[CLOUD] Consensus result = ${decision}. Event sent.`);
}
//# sourceMappingURL=cloud-recovery.js.map