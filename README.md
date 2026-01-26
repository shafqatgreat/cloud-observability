🌐 Cloud Observability – Node.js Microservices Monorepo

A complete end-to-end cloud observability project demonstrating how to build, connect, and observe Node.js microservices from local Docker-based tracing to cloud-native distributed tracing using Grafana Tempo and OpenTelemetry.

This repository is part of the tutorial series:

“Node.js Microservices — From Zero to Cloud”

📌 What This Project Demonstrates

This monorepo shows how real-world backend systems are built and observed:

✅ API Gateway architecture

✅ Authentication microservice

✅ Protected order service

✅ Distributed tracing with OpenTelemetry

✅ Local observability using Docker + Grafana

✅ Cloud observability using Grafana Cloud

✅ End-to-end request flow visibility

🧩 Monorepo Structure
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
└── README.md   ← (this file)

🏗 Architecture Overview
Client (Browser / API Tool)
        │
        ▼
   API Gateway
        │
        ├──► Auth Service
        │         └── Login / Token Verification
        │
        └──► Order Service
                  └── Protected Business Data


All communication flows only through the API Gateway — internal services are never accessed directly.

🔁 Request Workflow (Functional Flow)

Client sends login request to API Gateway

Gateway forwards request to Auth Service

Auth Service validates credentials and returns token

Client stores token

Client requests protected orders using token

Gateway verifies token via Auth Service

Gateway forwards request to Order Service

Order Service returns data

Response flows back to client

This mirrors how production microservices systems work.

🔍 Observability Flow

This project implements true distributed tracing:

Each service uses OpenTelemetry Node SDK

Traces propagate automatically across services

API Gateway acts as the root entry point

All spans appear under a single trace ID

Local Observability

Docker

Grafana

Tempo

OTLP HTTP exporter

Cloud Observability

Grafana Cloud

Tempo Cloud backend

Explorer + Drilldown views

🚀 Technologies Used

Node.js

Express.js

OpenTelemetry

Grafana Tempo

Grafana (UI)

Docker & Docker Compose

Cloudflare Workers (API Gateway deployment)

Railway (Microservices deployment)

▶️ Running Locally (Observability Setup)
1️⃣ Start observability stack
cd observability
docker compose up


This starts:

Tempo (trace backend)

Grafana UI

Grafana will be available at:

http://localhost:3000

2️⃣ Start services

In separate terminals:

cd auth-service
node index.js

cd order-service
node index.js

cd api-gateway
node index.js

3️⃣ Send test requests

Use:

Thunder Client

Postman

Browser test client

All traces will appear in Grafana → Explore → Tempo.

☁️ Cloud Deployment

This project also supports full cloud deployment:

Auth Service → Railway

Order Service → Railway

API Gateway → Cloudflare Workers

Tracing Backend → Grafana Cloud

Once configured:

Traces appear in Grafana Cloud

Full request lifecycle is visible across cloud boundaries

🎯 Learning Outcomes

By completing this project, you will understand:

How distributed tracing actually works

Why API Gateways are trace roots

How trace context flows across services

How Grafana Tempo links microservices

How to debug production systems visually

How cloud-native observability is implemented in real systems

📘 Tutorial Series

This repository is part of:

Node.js Microservices — From Zero to Cloud

The series covers:

Microservices fundamentals

API Gateway design

Authentication flow

Cloud deployment

Observability & tracing

Production debugging techniques

📜 License

MIT License
Free to use for learning and educational purposes.

⭐ Final Note

This project is intentionally designed to mirror real production architecture, not toy examples.

If you’re learning microservices, observability, or cloud-native backend systems — this repository gives you the full picture from first request to cloud trace visualization.