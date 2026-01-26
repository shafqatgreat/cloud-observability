# 🔐 Auth Service

The Auth Service is responsible for **user authentication and token validation**.

It is an internal microservice and must never be accessed directly by clients.

---

## 🎯 Responsibilities

- Handle login requests
- Generate identity tokens
- Verify tokens for protected routes
- Respond only to API Gateway

---

## 🔁 Request Flow

API Gateway
│
▼
Auth Service
│
├── POST /login
└── POST /verify


---

## 🔍 Observability Role

The Auth Service:

- Receives trace context from API Gateway
- Creates child spans
- Contributes to the same distributed trace

It never creates root traces.

---

## 🧩 Architecture Diagram

Client (never allowed)
✖

API Gateway
│
▼
Auth Service
│
└── Authentication Logic


---

## 📂 Files

| File | Description |
|------|-------------|
| `index.js` | Auth endpoints |
| `tracing.js` | OpenTelemetry SDK setup |
| `README.md` | Documentation |

---

## 🚀 Runtime

- Platform: Node.js (Express)
- Deployment: Railway
- Observability: OTLP → Tempo

---

## 📌 Summary

The Auth Service provides **identity trust** in the system and is reachable **only through the API Gateway**.
