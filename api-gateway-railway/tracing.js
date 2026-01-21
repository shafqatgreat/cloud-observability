'use strict';

const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
const { resourceFromAttributes } = require("@opentelemetry/resources");

function startTracing() {
  try {
    const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
    const authHeader = process.env.OTEL_EXPORTER_OTLP_HEADERS;

    if (!endpoint || !authHeader) {
      console.warn("⚠️ OpenTelemetry disabled — missing env vars");
      return;
    }

    const resource = resourceFromAttributes({
      "service.name": "api-gateway-railway",
      "service.version": "1.0.0",
    });

    const exporter = new OTLPTraceExporter({
      url: endpoint,
      headers: {
         authHeader,
      },
    });

    const sdk = new NodeSDK({
      resource,
      traceExporter: exporter,
      instrumentations: [getNodeAutoInstrumentations()],
    });

    // ✅ NO then(), NO await
    sdk.start();
    // ✅ expose globally
    global.otelSdk = sdk;
    console.log("✅ OpenTelemetry tracing started");

  } catch (err) {
    console.error("❌ Tracing setup error (ignored):", err.message);
  }
}

module.exports = startTracing;



















