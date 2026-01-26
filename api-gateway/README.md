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

