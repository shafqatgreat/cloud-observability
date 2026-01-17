'use strict';
const { NodeSDK } = require("@opentelemetry/sdk-node");
const { getNodeAutoInstrumentations } = require("@opentelemetry/auto-instrumentations-node");
const { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http");

const OTEL_EXPORTER_OTLP_ENDPOINT = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
const OTEL_EXPORTER_OTLP_HEADERS = process.env.OTEL_EXPORTER_OTLP_HEADERS; // should be like "Basic <token>"


const exporter = new OTLPTraceExporter({
  url: OTEL_EXPORTER_OTLP_ENDPOINT,
  headers: {
    Authorization:"Basic%20MTQ5NzY5ODpnbGNfZXlKdklqb2lNVFkwTXpNek15SXNJbTRpT2lKdGVTMXVaWGN0ZEc5clpXNGlMQ0pySWpvaU1tWXdZWE13TkVwek5XazNNVlV6U0RWRk1uaElSRVpOSWl3aWJTSTZleUp5SWpvaWNISnZaQzF0WlMxalpXNTBjbUZzTFRFaWZYMD0=",
  },
});

const sdk = new NodeSDK({
  
  traceExporter: exporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

console.log("Auth Service tracing initialized");
