const { trace } = require("@opentelemetry/api");

module.exports = trace.getTracer("api-gateway-tracer");
