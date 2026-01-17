'use strict';
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
// const { Resource } = require("@opentelemetry/resources");

// const resource = new Resource({
//   "service.name": "auth-service",
//   "service.version": "1.0.0",
// });

const OTEL_EXPORTER_OTLP_ENDPOINT = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
const OTEL_EXPORTER_OTLP_HEADERS = process.env.OTEL_EXPORTER_OTLP_HEADERS; // should be like "Basic <token>"


const exporter = new OTLPTraceExporter({
  url: OTEL_EXPORTER_OTLP_ENDPOINT,
  headers: {
    Authorization:`${OTEL_EXPORTER_OTLP_HEADERS}`,
  },
});

const sdk = new NodeSDK({
  traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations()],
  // resource,
});

sdk.start();

console.log("Auth Service tracing initialized");
