# 📦 Order Service

The Order Service provides **protected business data**.

Access is allowed only after successful authentication.

---

## 🎯 Responsibilities

- Serve order-related data
- Validate access via API Gateway
- Represent business domain logic

---

## 🔁 Request Flow

Client
│
▼
API Gateway
│
├── verify token
│
▼
Order Service
│
└── Return orders


---

## 🔍 Observability Role

- Receives trace headers from API Gateway
- Creates child spans
- Appears as part of the same distributed trace

---

## 🧩 Architecture Diagram

API Gateway
│
▼
Order Service
│
└── Business Logic


---

## 📂 Files

| File | Description |
|------|-------------|
| `index.js` | Order endpoints |
| `tracing.js` | OpenTelemetry setup |
| `README.md` | Documentation |

---

## 🚀 Runtime

- Platform: Node.js (Express)
- Deployment: Railway
- Observability: OTLP → Tempo

---

## 📌 Summary

The Order Service represents a protected microservice whose visibility and access are fully controlled by the API Gateway.
