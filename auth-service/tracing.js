'use strict';
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");

const OTEL_EXPORTER_OTLP_ENDPOINT="https://otlp-gateway-prod-me-central-1.grafana.net/otlp/v1/traces"
const OTEL_EXPORTER_OTLP_HEADERS="Authorization=Basic%20MTQ5NzY5ODpnbGNfZXlKdklqb2lNVFkwTXpNek15SXNJbTRpT2lKamJTMTBiMnRsYmlJc0ltc2lPaUpyY2xnM1dETmxTRWN3T1hOc01ESlhORzVxZHpOeU56Y2lMQ0p0SWpwN0luSWlPaUp3Y205a0xXMWxMV05sYm5SeVlXd3RNU0o5ZlE9PQ=="
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
    headers,
  });


const sdk = new NodeSDK({
  traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

console.log("Auth Service tracing initialized");




