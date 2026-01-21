'use strict';

const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { Resource } = require('@opentelemetry/resources');

function setupTracing() {
  try {
    const endpoint = process.env.OTEL_EXPORTER_OTLP_ENDPOINT;
    const headers = process.env.OTEL_EXPORTER_OTLP_HEADERS
      ? JSON.parse(process.env.OTEL_EXPORTER_OTLP_HEADERS)
      : {};

    if (!endpoint) {
      console.warn('⚠️ OpenTelemetry disabled — missing OTEL_EXPORTER_OTLP_ENDPOINT');
      return;
    }

    const sdk = new NodeSDK({
      resource: new Resource({
        'service.name': 'api-gateway-railway',
        'service.version': '1.0.0',
      }),
      traceExporter: new OTLPTraceExporter({
        url: endpoint,
        headers,
      }),
      instrumentations: [getNodeAutoInstrumentations()],
    });

    sdk.start();
    console.log('✅ OpenTelemetry tracing started for API Gateway');
  } catch (err) {
    console.error('❌ Tracing setup error:', err.message);
  }
}

module.exports = setupTracing;
