import { AtomicComponent, StateMachine, StateMachineState } from "@sorrir/framework";
declare enum RideDStates {
    FORWARDING = "FORWARDING",
    REROUTING = "REROUTING"
}
export declare enum RideDPorts {
    FINAL_OUTPUT = "FINAL_OUTPUT"
}
export declare const sm: StateMachine<RideDStates, {
    currentPath: string | null;
}, any, RideDPorts>;
export declare const rideD: AtomicComponent<any, RideDPorts>;
export declare const rideDStartState: StateMachineState<RideDStates, {
    currentPath: string | null;
}, any, RideDPorts>;
export {};
