import { NodeSDK } from "@opentelemetry/sdk-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";

const observabilityIp = process.env.OBSERVABILITY_VM_IP || "localhost";
const endpoint = process.env.JAEGER_ENDPOINT || `http://${observabilityIp}:16686/api/traces`;

const sdk = new NodeSDK({
  traceExporter: new JaegerExporter({
    endpoint,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
