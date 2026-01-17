'use strict';
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");



const OTEL_EXPORTER_OTLP_ENDPOINT = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
const OTEL_EXPORTER_OTLP_HEADERS = process.env.OTEL_API_TOKEN;


const exporter = new OTLPTraceExporter({
    // url: "http://localhost:4318/v1/traces"
    // url: "https://shafqatgreat.grafana.net/otlp/v1/traces",
    url: OTEL_EXPORTER_OTLP_ENDPOINT,
     headers: {OTEL_EXPORTER_OTLP_HEADERS,},
  });


const sdk = new NodeSDK({
  traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

console.log("Auth Service tracing initialized");




