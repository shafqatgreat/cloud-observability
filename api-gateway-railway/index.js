'use strict';

require('./tracing')(); // must be FIRST

const {
  context,
  propagation,
  trace,
  SpanKind
} = require('@opentelemetry/api');

const tracer = trace.getTracer('api-gateway-tracer');

const express = require('express');
const app = express();
app.use(express.json());

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL;

/**
 * ==================================================
 * ROOT TRACE MIDDLEWARE — GATEWAY IS TRACE BOUNDARY
 * ==================================================
 */
app.use((req, res, next) => {

  /**
   * 🚨 CRITICAL RULE
   * ----------------
   * External callers (browser, postman, curl)
   * MUST NOT be parent of trace.
   *
   * Gateway ALWAYS starts the trace.
   */

  const isInternalCall = req.headers['x-internal-call'];

  const ctx = isInternalCall
    ? propagation.extract(context.active(), req.headers)
    : context.active(); // 🔥 ROOT CREATED HERE

  const span = tracer.startSpan(
    `HTTP ${req.method} ${req.path}`,
    {
      kind: SpanKind.SERVER,
      attributes: {
        'service.name': 'api-gateway-railway',
        'http.method': req.method,
        'http.route': req.path,
      },
    },
    ctx
  );

  const spanCtx = trace.setSpan(ctx, span);

  context.with(spanCtx, () => {
    res.on('finish', () => {
      span.setAttribute('http.status_code', res.statusCode);
      span.end();
    });
    next();
  });
});

/**
 * --------------------
 * CORS
 * --------------------
 */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type,Authorization,x-trace-id'
  );

  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

/**
 * --------------------
 * TRACE INJECTION
 * --------------------
 */
function injectTraceHeaders(headers = {}) {
  const carrier = {};
  propagation.inject(context.active(), carrier);

  return {
    ...headers,
    ...carrier,
    'x-internal-call': 'true', // 🔥 VERY IMPORTANT
  };
}

/**
 * --------------------
 * LOGIN
 * --------------------
 */
app.post('/login', async (req, res) => {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/login`, {
      method: 'POST',
      headers: injectTraceHeaders({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * --------------------
 * AUTHORIZATION
 * --------------------
 */
async function authorize(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/verify`, {
      method: 'POST',
      headers: injectTraceHeaders({
        'Content-Type': 'application/json',
        Authorization: token,
      }),
    });

    const data = await response.json();
    if (!data.valid)
      return res.status(401).json({ message: 'Unauthorized' });

    req.user = data.user;
    next();

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

/**
 * --------------------
 * ORDERS
 * --------------------
 */
app.all('/orders', authorize, async (req, res) => {
  try {
    const options = {
      method: req.method,
      headers: injectTraceHeaders({
        'Content-Type': 'application/json',
        'x-user-id': req.user.id,
        'x-user-email': req.user.email,
        'x-user-role': req.user.role,
      }),
    };

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      options.body = JSON.stringify(req.body);
    }

    const response = await fetch(`${ORDER_SERVICE_URL}/orders`, options);
    const data = await response.json();

    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * --------------------
 * START SERVER
 * --------------------
 */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ API Gateway running on port ${PORT}`)
);
