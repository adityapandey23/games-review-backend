# Observability VM (VM-2) Setup Guide

This guide contains everything you need to run on your dedicated Observability VM ("VM-2").
The Express backend has been configured to push its traces and logs here, and expose its metrics for scraping.

## Prerequisites
- A Linux VM (Ubuntu/Debian preferred).
- SSH access.
- Ports `9090` (Prometheus), `3100` (Loki), `16686` (Jaeger UI), and `14268` (Jaeger Collector) should be open/accessible from your API server and your own computer for Grafana.
- Docker & Docker Compose installed (recommended for ease of deployment).

---

## The Easiest Way: Docker Compose (Recommended on VM-2)

Rather than downloading binaries manually, simply run this `docker-compose.yml` on VM-2.

1. Create a directory on VM-2:
```bash
mkdir observability
cd observability
```

2. Create `docker-compose.yml`:
```yaml
version: "3.8"
services:
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml

  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml

  jaeger:
    image: jaegertracing/all-in-one:latest
    ports:
      - "16686:16686" # UI
      - "14268:14268" # Collector HTTP
      - "4317:4317"   # OTLP gRPC
      - "4318:4318"   # OTLP HTTP
    environment:
      - COLLECTOR_OTLP_ENABLED=true
```

3. Create `prometheus.yml` in the same directory:
```yaml
global:
  scrape_interval: 5s

scrape_configs:
  - job_name: "express-backend"
    static_configs:
      - targets: ["<YOUR_API_VM_IP>:3000"] # <--- REPLACE THIS WITH YOUR EXPRESS API IP
```

4. Start the stack on VM-2:
```bash
docker-compose up -d
```

## Manual Binary Setup (If Docker is not an option)

If you prefer exactly what was outlined in your plan:

### 1. Prometheus
```bash
wget https://github.com/prometheus/prometheus/releases/latest/download/prometheus-linux-amd64.tar.gz
tar -xvzf prometheus-linux-amd64.tar.gz
cd prometheus-*

# Create prometheus.yml like the one in step 3 above, then run:
./prometheus --config.file=prometheus.yml
```

### 2. Loki
```bash
wget https://github.com/grafana/loki/releases/latest/download/loki-linux-amd64.zip
unzip loki-linux-amd64.zip

# Create a local-config.yaml or use default config out of the box, then run:
./loki-linux-amd64 -config.file=local-config.yaml
```

### 3. Jaeger
```bash
wget https://github.com/jaegertracing/jaeger/releases/latest/download/jaeger-all-in-one-linux-amd64.tar.gz
tar -xvzf jaeger-*.tar.gz
cd jaeger-*

./jaeger-all-in-one
```

---

## Next Steps

1. Start up your Observability VM-2 using the steps above.
2. In your Express project, ensure the `.env` file reflects the **IP address of VM-2**:
   `OBSERVABILITY_VM_IP=<VM-2-PUBLIC-OR-PRIVATE-IP>`
3. Connect your free Grafana Cloud instance to your VM-2 IP using ports `9090`, `3100`, and `16686`.
