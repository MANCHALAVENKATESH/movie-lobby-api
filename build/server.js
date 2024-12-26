"use strict";
// src/server.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const port = process.env.PORT || 3000;
mongoose_1.default
    .connect(process.env.MONGODB_URI || '', {})
    .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app_1.default.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
})
    .catch((err) => {
    console.error('Database connection error:', err);
});
