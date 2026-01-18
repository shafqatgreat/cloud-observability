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
      console.warn("⚠️ OpenTelemetry disabled — env vars missing");
      return;
    }

    const resource = resourceFromAttributes({
      "service.name": "auth-service",
      "service.version": "1.0.0",
    });

    const exporter = new OTLPTraceExporter({
      url: endpoint,
      headers: {
        Authorization: authHeader,
      },
    });

    const sdk = new NodeSDK({
      resource,
      traceExporter: exporter,
      instrumentations: [getNodeAutoInstrumentations()],
    });

    sdk.start()
      .then(() => {
        console.log("✅ OpenTelemetry tracing started");
      })
      .catch((err) => {
        console.error("❌ Tracing init failed (ignored):", err.message);
      });

  } catch (err) {
    console.error("❌ Tracing setup error (ignored):", err.message);
  }
}

module.exports = startTracing;





















// 'use strict';
// const { NodeSDK } = require("@opentelemetry/sdk-node");
// const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
// const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");
// // const { Resource } = require("@opentelemetry/resources");

// // const resource = new Resource({
// //   "service.name": "auth-service",
// //   "service.version": "1.0.0",
// // });

// const OTEL_EXPORTER_OTLP_ENDPOINT = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
// const OTEL_EXPORTER_OTLP_HEADERS = process.env.OTEL_EXPORTER_OTLP_HEADERS; // should be like "Basic <token>"


// const exporter = new OTLPTraceExporter({
//   url: OTEL_EXPORTER_OTLP_ENDPOINT,
//   headers: {
//     Authorization:`${OTEL_EXPORTER_OTLP_HEADERS}`,
//   },
// });

// const sdk = new NodeSDK({
//   traceExporter: exporter,
//   instrumentations: [getNodeAutoInstrumentations()],
//   // resource,
// });

// sdk.start();

// console.log("Auth Service tracing initialized");
