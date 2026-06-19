"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

class PingInfo {
    constructor() {
        this.pings = [];
        this.lastTimestamp = 0;
        this.samplesLeft = 10; // Сколько раз "стучимся" до клиента
    }
}

exports.default = PingInfo;