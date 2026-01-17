'use strict';

const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
const { Resource } = require("@opentelemetry/resources");

async function startTracing() {
  const resource = new Resource({
    "service.name": "auth-service",
    "service.version": "1.0.0",
  });

  const exporter = new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    headers: {
      Authorization: process.env.OTEL_EXPORTER_OTLP_HEADERS,
    },
  });

  const sdk = new NodeSDK({
    resource,
    traceExporter: exporter,
    instrumentations: [getNodeAutoInstrumentations()],
  });

  await sdk.start(); // ✅ IMPORTANT
  console.log("Auth Service tracing initialized");
}

startTracing().catch(err => {
  console.error("Tracing failed to start", err);
});
