import { AtomicComponent, StateMachine, StateMachineState } from "@sorrir/framework";
export declare enum RideCPorts {
    TO_RIDE_D = "TO_RIDE_D"
}
export declare enum RideCEventTypes {
    RECOVERY = "RECOVERY",
    FAULT = "FAULT"
}
declare enum RideCStates {
    MONITOR = "MONITOR",
    RECOVERING = "RECOVERING"
}
export declare const sm: StateMachine<RideCStates, {
    paths: string[];
}, RideCEventTypes, RideCPorts>;
export declare const rideC: AtomicComponent<RideCEventTypes, RideCPorts, unknown>;
export declare const rideCStartState: StateMachineState<RideCStates, {
    paths: string[];
}, RideCEventTypes, RideCPorts>;
export {};
