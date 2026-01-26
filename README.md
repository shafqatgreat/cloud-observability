# 🌐 Cloud Observability — Node.js Microservices Monorepo

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

## 🧩 Monorepo Structure

cloud-observability/
│
├── api-gateway/
│ ├── index.js
│ ├── tracing.js
│ └── README.md
│
├── auth-service/
│ ├── index.js
│ ├── tracing.js
│ └── README.md
│
├── order-service/
│ ├── index.js
│ ├── tracing.js
│ └── README.md
│
├── observability/
│ ├── docker-compose.yml
│ ├── tempo.yaml
│ └── grafana/
│
└── README.md ← (this file)


---

## 🏗 Complete Architecture Overview

Client (Browser / API Tool)
│
▼
┌──────────────────────────┐
│ API Gateway │
│ (Cloudflare Workers) │
│ Trace Root │
└───────────┬──────────────┘
│
│ trace context
▼
┌────────────────────┐
│ Auth Service │
│ (Railway) │
│ Login / Verify JWT │
└──────────┬─────────┘
│
│ verified token
▼
┌────────────────────┐
│ Order Service │
│ (Railway) │
│ Protected Resources │
└────────────────────┘

          │
          ▼


┌──────────────────────────┐
│ Grafana Tempo │
│ Distributed Trace Store │
│ (Local or Cloud) │
└──────────────────────────┘


### 🔒 Important Rule

> All traffic flows **only through the API Gateway**.  
> Internal services are **never accessed directly by clients**.

---

## 🔁 Functional Request Workflow

This section explains the **business workflow (without tracing)**.

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

This mirrors how production backend systems operate.

---

## 🔍 Observability Flow (Distributed Tracing)

This project implements **true distributed tracing**.

### How tracing works:

- Every service uses OpenTelemetry Node SDK
- Trace headers propagate automatically
- API Gateway acts as the **root span**
- Auth Service and Order Service create child spans
- All spans share a single trace ID
- Entire lifecycle appears in Grafana

### Result in Grafana:

api-gateway ← ROOT
├── auth-service
│ └── verify
└── order-service
└── getOrders


This allows full visibility across services and cloud boundaries.

---

## 🧪 Local Observability Stack

The `observability/` module provides local tracing using Docker.

### Includes:

- Grafana Tempo (trace backend)
- Grafana UI
- OTLP HTTP ingestion
- Local visualization

### Start local observability

```bash
cd observability
docker compose up
Grafana UI will be available at:

http://localhost:3000

▶️ Running Services Locally

In separate terminals:

cd auth-service
node index.js

cd order-service
node index.js

cd api-gateway
node index.js


Send requests using:

Thunder Client

Postman

Browser test client

All traces will appear in:

Grafana → Explore → Tempo

☁️ Cloud Deployment

This project supports full cloud-native deployment.

Deployment Mapping
Component	Platform
API Gateway	Cloudflare Workers
Auth Service	Railway
Order Service	Railway
Tracing Backend	Grafana Cloud
Visualization	Grafana Cloud UI

Once configured:

Traces flow across internet boundaries

All services appear under one trace

Explorer & Drilldown show full lifecycle

🚀 Technologies Used

Node.js

Express.js

OpenTelemetry

Grafana Tempo

Grafana UI

Docker & Docker Compose

Cloudflare Workers

Railway

HTTP / OTLP

🎓 Learning Outcomes

After completing this project, you will understand:

How distributed tracing works internally

Why API Gateways must be trace roots

How context propagation links services

How Grafana Tempo builds service graphs

How production systems are debugged visually

How cloud observability is implemented end-to-end

## 📘 Tutorial Series

This repository is part of:

Node.js Microservices — From Zero to Cloud on YouTube

The series covers:

Microservices fundamentals

API Gateway design

Authentication architecture

Cloud deployment strategies

Distributed tracing

Production debugging techniques

## 📜 License

MIT License
Free to use for learning and educational purposes.

## ⭐ Final Note

This project is intentionally designed to reflect real production architecture, not simplified demos.

If you are learning:

Microservices

Cloud-native backend systems

Observability

Distributed tracing

This repository gives you the complete picture — from the first client request to cloud trace visualization.