import { StateMachine, StateMachineState, AtomicComponent } from "@sorrir/framework";
export declare enum GenericSensorEventTypes {
    DETECTION = "DETECTION",
    NOTHING = "NOTHING",
    FAULT = "FAULT"
}
export declare enum GenericSensorPorts {
    TO_DSB = "TO_DSB"
}
export declare enum GenericSensorStates {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    FAULTY = "FAULTY"
}
type GenericSensorMemory = number;
export declare const createSensorFSM: (name: string) => AtomicComponent<GenericSensorEventTypes, GenericSensorPorts> & {
    sm: StateMachine<GenericSensorStates, GenericSensorMemory, GenericSensorEventTypes, GenericSensorPorts>;
};
export declare const cam1Sensor: AtomicComponent<GenericSensorEventTypes, GenericSensorPorts, undefined> & {
    sm: StateMachine<GenericSensorStates, GenericSensorMemory, GenericSensorEventTypes, GenericSensorPorts>;
};
export declare const cam2Sensor: AtomicComponent<GenericSensorEventTypes, GenericSensorPorts, undefined> & {
    sm: StateMachine<GenericSensorStates, GenericSensorMemory, GenericSensorEventTypes, GenericSensorPorts>;
};
export declare const cloudSensor: AtomicComponent<GenericSensorEventTypes, GenericSensorPorts, undefined> & {
    sm: StateMachine<GenericSensorStates, GenericSensorMemory, GenericSensorEventTypes, GenericSensorPorts>;
};
export declare const fog0Sensor: AtomicComponent<GenericSensorEventTypes, GenericSensorPorts, undefined> & {
    sm: StateMachine<GenericSensorStates, GenericSensorMemory, GenericSensorEventTypes, GenericSensorPorts>;
};
export declare const irrigationSensor: AtomicComponent<GenericSensorEventTypes, GenericSensorPorts, undefined> & {
    sm: StateMachine<GenericSensorStates, GenericSensorMemory, GenericSensorEventTypes, GenericSensorPorts>;
};
export declare const soilSensor: AtomicComponent<GenericSensorEventTypes, GenericSensorPorts, undefined> & {
    sm: StateMachine<GenericSensorStates, GenericSensorMemory, GenericSensorEventTypes, GenericSensorPorts>;
};
export declare const signalMonitorSensor: AtomicComponent<GenericSensorEventTypes, GenericSensorPorts, undefined> & {
    sm: StateMachine<GenericSensorStates, GenericSensorMemory, GenericSensorEventTypes, GenericSensorPorts>;
};
export declare const genericStartState: (initial?: GenericSensorStates) => StateMachineState<GenericSensorStates, GenericSensorMemory, GenericSensorEventTypes, GenericSensorPorts>;
export {};
