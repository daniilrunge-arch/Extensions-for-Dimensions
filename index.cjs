"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

const config_1 = require("./config.cjs");
const pinginfo_1 = require("./pinginfo.cjs");

var PingExtension = (function () {
    function PingExtension() {
        this.name = "PingExtension";
        this.config = config_1;
        this.inprogressKey = "ping-inprogress";
    }

    PingExtension.prototype.priorPacketHandlers = {
        clientHandler: {
            handlePacket: function (client, packet) {
                const self = client.globalHandlers.extensions.PingExtension;

                // 1. ПЕРЕХВАТ КОМАНДЫ
                if (packet.packetType === 25 || packet.packetType === 82) {
                    const rawText = packet.data.toString('utf-8');
                    if (rawText.includes("/ping")) {
                        // Создаем метку, что мы ждем следующий пакет для замера
                        client.extProperties = client.extProperties || new Map();
                        client.extProperties.set(self.inprogressKey, {
                            start: Date.now(),
                            state: "WAITING"
                        });

                        client.sendChatMessage("[c/00EEEE:PING:] Замеряем пинг...");
                        return true; 
                    }
                }

                // 2. ПАССИВНЫЙ ЗАМЕР
                // Мы просто смотрим, когда придет ЛЮБОЙ следующий пакет от клиента
                // Это и будет время прохождения сигнала (RTT)
                const properties = client.extProperties || new Map();
                if (properties.has(self.inprogressKey)) {
                    const info = properties.get(self.inprogressKey);
                    
                    if (info.state === "WAITING") {
                        const rtt = Date.now() - info.start;
                        properties.delete(self.inprogressKey);

                        // Небольшая поправка на частоту тиков (около 16мс)
                        let finalPing = rtt;
                        if (finalPing < 0) finalPing = 0;

                        client.sendChatMessage("[c/00EEEE:Ping:] Ваш пинг примерно: [c/32ff7e:" + finalPing + " мс]");
                    }
                }
                return false;
            }
        }
    };

    return PingExtension;
}());

exports.default = PingExtension;