import { Event, FSMState } from "@sorrir/framework";
export declare enum EventType {
    COMMAND = "COMMAND",
    EVENT = "EVENT",
    INTERNAL = "INTERNAL"
}
export declare function sendEvent(event: Event): Promise<void>;
export declare function performCloudRecovery(sensorStates: FSMState[]): Promise<void>;
