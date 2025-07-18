"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.example_config = void 0;
exports.example_config = {
    name: "mock-model",
    async run() {
        console.log("Mock simulation is running...");
        // simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }
};
//# sourceMappingURL=example-config.js.map