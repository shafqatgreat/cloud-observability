# 🌐 Cloud Observability — Node.js Microservices

A complete **end-to-end cloud observability project** demonstrating how to design, deploy, and observe **Node.js microservices** — starting from **local Docker-based tracing** and progressing to **cloud-native distributed tracing** using **OpenTelemetry and Grafana Tempo**.

This repository is part of the tutorial series:

> **Node.js Microservices — From Zero to Cloud**

The goal of this project is not to demonstrate isolated services, but to show **how real production systems are built, connected, and debugged using observability**.

---

## 🎯 Project Purpose

Modern microservices do not fail because of code alone —  
they fail because **engineers cannot see what is happening across services**.

This project teaches:

- How requests travel across services  
- How trace context flows  
- Why API Gateways must act as trace roots  
- How distributed tracing works in real systems  
- How cloud-native observability is implemented end-to-end  

This is **not a toy example** — it mirrors real production architecture.

---

## 📌 What This Project Demonstrates

✔ API Gateway–based architecture  
✔ Authentication microservice  
✔ Protected order service  
✔ Distributed tracing using OpenTelemetry  
✔ Trace propagation across services  
✔ Local observability using Docker + Grafana  
✔ Cloud observability using Grafana Cloud  
✔ End-to-end request visibility  
✔ Debugging using Grafana Explorer & Drilldown  

---

## 🧩 Project Structure

```text
cloud-observability/
│
├── api-gateway/
│   ├── index.js
│   ├── tracing.js
│   └── README.md
│
├── auth-service/
│   ├── index.js
│   ├── tracing.js
│   └── README.md
│
├── order-service/
│   ├── index.js
│   ├── tracing.js
│   └── README.md
│
├── observability/
│   ├── docker-compose.yml
│   ├── tempo.yaml
│   └── grafana/
│
└── README.md
```

---

## 🏗 Complete Architecture Overview

```text
Client (Browser / API Tool)
        │
        ▼
┌──────────────────────────┐
│        API Gateway       │
│   (Cloudflare Workers)   │
│        Trace Root        │
└───────────┬──────────────┘
            │
            │ trace context
            ▼
┌────────────────────┐
│    Auth Service     │
│      (Railway)      │
│  Login / Verify JWT │
└──────────┬─────────┘
           │
           │ verified token
           ▼
┌────────────────────┐
│   Order Service     │
│      (Railway)      │
│  Protected Resources│
└────────────────────┘

            │
            ▼
┌──────────────────────────┐
│       Grafana Tempo       │
│  Distributed Trace Store  │
│     (Local / Cloud)       │
└──────────────────────────┘
```

### 🔒 Important Rule

> All traffic flows **only through the API Gateway**.  
> Internal services are **never accessed directly by clients**.

---

## 🔁 Functional Request Workflow

1. Client sends login request to API Gateway  
2. API Gateway forwards request to Auth Service  
3. Auth Service validates credentials  
4. Auth Service returns identity token  
5. Client stores token locally  
6. Client requests protected orders using token  
7. API Gateway verifies token via Auth Service  
8. API Gateway forwards request to Order Service  
9. Order Service returns protected data  
10. Response flows back to client  

---

## 🔍 Observability Flow (Distributed Tracing)

- Each service uses OpenTelemetry Node SDK  
- Trace headers propagate automatically  
- API Gateway acts as the **root span**  
- Downstream services create child spans  
- All spans share the same trace ID  

### Result in Grafana:

```text
api-gateway  ← ROOT
├── auth-service
│   └── verify
└── order-service
    └── getOrders
```

---

## 🧪 Local Observability Stack

Located inside `observability/`

Includes:

- Grafana Tempo
- Grafana UI
- OTLP HTTP ingestion
- Docker Compose setup

### Start locally

```bash
cd observability
docker compose up
```

Grafana UI:

```
http://localhost:3000
```

---

## ▶️ Run Services Locally

```bash
cd auth-service
node index.js

cd order-service
node index.js

cd api-gateway
node index.js
```

Send requests using:

- Thunder Client  
- Postman  
- Browser test client  

View traces in:

**Grafana → Explore → Tempo**

---

## ☁️ Cloud Deployment

| Component | Platform |
|--------|---------|
| API Gateway | Cloudflare Workers |
| Auth Service | Railway |
| Order Service | Railway |
| Tracing Backend | Grafana Cloud |
| Visualization | Grafana Cloud UI |

Once configured:

- Traces flow across cloud boundaries  
- Services appear under one trace  
- Full lifecycle visible in Explorer & Drilldown  

---

## 🚀 Technologies Used

- Node.js  
- Express.js  
- OpenTelemetry  
- Grafana Tempo  
- Grafana UI  
- Docker & Docker Compose  
- Cloudflare Workers  
- Railway  
- OTLP HTTP  

---

## 🎓 Learning Outcomes

You will understand:

- Distributed tracing internals  
- API Gateway trace root design  
- Context propagation  
- Service graph visualization  
- Production debugging techniques  
- End-to-end cloud observability  

---

## 📘 Tutorial Series

**Node.js Microservices — From Zero to Cloud**

Covers:

- Microservices fundamentals  
- API Gateway architecture  
- Authentication flow  
- Cloud deployments  
- Observability & tracing  
- Production debugging  

---

## 📜 License

MIT License  
Free for learning and educational use.

---

## ⭐ Final Note

This repository is designed to mirror **real production architecture**, not simplified demos.

If you are learning microservices, cloud-native systems, or observability —  
this project provides the **complete picture from client request to cloud trace visualization**.

---

## 👤 Author

**Shafqat Altaf**  
Serverless • Microservices • API Gateway Architectures  

---

## 📺 YouTube

**CodingMavrick**  
Observability & Distributed Tracing in Node.js Microservices | OpenTelemetry 
https://youtu.be/wyiem6fc47Q