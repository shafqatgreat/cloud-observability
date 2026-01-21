'use strict';

require('./tracing')(); // same as auth-service
const { context, propagation } = require("@opentelemetry/api");

app.use((req, res, next) => {

  // extract incoming trace context
  const ctx = propagation.extract(context.active(), req.headers);

  const span = tracer.startSpan(
    `API ${req.method} ${req.path}`,
    {
      kind: 1, // SERVER
    },
    ctx
  );

  // bind span to request lifecycle
  context.with(trace.setSpan(ctx, span), () => {

    res.on("finish", () => {
      span.setAttribute("http.status_code", res.statusCode);
      span.end();
    });

    next();
  });
});


// Express Tasks********
const express = require('express');
const app = express();
app.use(express.json());

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL;

// --------------------
// CORS
// --------------------
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-trace-id');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// --------------------
// Trace headers
// --------------------
function extractTraceHeaders(req) {
  const headers = {};
  const tp = req.headers['traceparent'];
  const ts = req.headers['tracestate'];
  if (tp) headers.traceparent = tp;
  if (ts) headers.tracestate = ts;
  return headers;
}

// --------------------
// Forward login
// --------------------
app.post('/login', async (req, res) => {
  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...extractTraceHeaders(req),
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --------------------
// Authorization middleware
// --------------------
async function authorize(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const response = await fetch(`${AUTH_SERVICE_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
        ...extractTraceHeaders(req),
      },
    });
    const data = await response.json();
    if (!data.valid) return res.status(401).json({ message: 'Unauthorized' });

    req.user = data.user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// --------------------
// Forward order request
// --------------------
app.all('/orders', authorize, async (req, res) => {
  try {
    const options = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': req.user.id,
        'x-user-email': req.user.email,
        'x-user-role': req.user.role,
        ...extractTraceHeaders(req),
      },
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

// --------------------
// Start server
// --------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));