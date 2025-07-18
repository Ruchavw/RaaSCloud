import { AtomicComponent, StateMachine, StateMachineState } from "@sorrir/framework";
import { FaultHandlerEventTypes } from "./fault-handler";
declare enum States {
    ANALYZING = "ANALYZING",
    RECOVERING = "RECOVERING"
}
export declare enum RaaSPorts {
    TO_FAULT_HANDLER = "TO_FAULT_HANDLER"
}
export declare const sm: StateMachine<States, undefined, FaultHandlerEventTypes, RaaSPorts>;
export declare const raasAgent: AtomicComponent<FaultHandlerEventTypes, RaaSPorts>;
export declare const raasAgentStartState: StateMachineState<States, undefined, FaultHandlerEventTypes, RaaSPorts>;
export {};
