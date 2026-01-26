# 🌐 API Gateway

The API Gateway is the **single entry point** for all client requests in this system.

It is responsible for:
- Routing requests to internal microservices
- Enforcing authentication
- Acting as the **root of distributed traces**
- Hiding internal service architecture from clients

---

## 🎯 Responsibilities

- Accept all client traffic
- Create or continue trace context
- Forward requests to backend services
- Attach authorization headers
- Prevent direct access to internal services

---

## 🔁 Request Flow

Client
│
▼
API Gateway
│
├──► Auth Service (login / token verification)
│
└──► Order Service (protected resource)


---

## 🔍 Observability Role

The API Gateway acts as:

> **Trace Root**

Every request begins here.

It:
- Creates the initial trace
- Propagates trace headers downstream
- Links all services under a single trace ID

Without this, services appear as isolated traces.

---

## 📂 Files

| File | Description |
|------|-------------|
| `index.js` | Gateway routing and request forwarding |
| `tracing.js` | OpenTelemetry initialization |
| `README.md` | Service documentation |

---

## 🚀 Runtime

- Platform: Cloudflare Workers / Node.js
- Protocol: HTTP
- Observability: OpenTelemetry → Tempo

---

## 🔐 Security Model

- Clients never call internal services directly
- Tokens are verified via Auth Service
- Internal URLs remain private

---

## 📌 Summary

The API Gateway is the **control plane** of the system — responsible for security, routing, and observability entry.
