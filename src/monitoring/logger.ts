import pino from "pino";
import pinoHttp from "pino-http";

const observabilityIp = process.env.OBSERVABILITY_VM_IP || "localhost";
const lokiHost = process.env.LOKI_HOST || `http://${observabilityIp}:3100`;

export const logger = pino({
  transport: {
    target: "pino-loki",
    options: {
      host: lokiHost,
      labels: { app: "games-review-backend" },
    },
  },
});

export const httpLogger = pinoHttp({ logger });
