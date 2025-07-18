"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateModel = simulateModel;
const mock_model_1 = require("./mock-model");
console.info("Starting the SORRIR example-1-mvp simulation...");
async function simulateModel(model) {
    console.log(`[Simulator] Simulating model: ${model.name}`);
    await model.run();
}
simulateModel(mock_model_1.example_config).then(() => {
    console.info("Simulation finished.");
});
//# sourceMappingURL=main.js.map