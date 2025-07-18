"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulateModel = simulateModel;
async function simulateModel(model) {
    console.log(`[Simulator] Simulating model: ${model.name}`);
    await model.run();
}
//# sourceMappingURL=sorrir-simulator.js.map