'use strict';
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
const { resourceFromAttributes } = require("@opentelemetry/resources");
const {
  SERVICE_NAME,
  SERVICE_VERSION,
} = require("@opentelemetry/semantic-conventions");

const resources = resourceFromAttributes({
  [SERVICE_NAME]: "auth-service",
  [SERVICE_VERSION]: "1.0.0",
});


const OTEL_EXPORTER_OTLP_ENDPOINT = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
const OTEL_EXPORTER_OTLP_HEADERS = process.env.OTEL_API_TOKEN;

// Convert "Authorization=Basic xxx" → object
const headers = Object.fromEntries(
  OTEL_EXPORTER_OTLP_HEADERS.split(",").map(h => {
    const [k, v] = h.split("=");
    return [k, v];
  })
);
const exporter = new OTLPTraceExporter({
    // url: "http://localhost:4318/v1/traces"
    // url: "https://shafqatgreat.grafana.net/otlp/v1/traces",
    url: OTEL_EXPORTER_OTLP_ENDPOINT,
     headers: {OTEL_API_TOKEN,},
  });


const sdk = new NodeSDK({
  resource: resources,
  traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

console.log("Auth Service tracing initialized");




