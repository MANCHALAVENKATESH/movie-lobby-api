"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisClient = (0, redis_1.createClient)({
    socket: {
        host: redisHost,
        port: redisPort,
    },
});
// Handle Redis client errors
redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});
// Handle successful connection
redisClient.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Redis client connected successfully');
    // Store a sample cache
    try {
        yield redisClient.set('sample_key', 'Hello, Redis!');
        console.log('Sample cache set: sample_key = Hello, Redis!');
        // Retrieve the sample cache to verify
        const value = yield redisClient.get('sample_key');
        console.log('Retrieved from cache:', value);
    }
    catch (err) {
        console.error('Error setting or getting cache:', err);
    }
}));
// Connect the client
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield redisClient.connect();
    }
    catch (err) {
        console.error('Error connecting to Redis:', err);
    }
}))();
exports.default = redisClient;
