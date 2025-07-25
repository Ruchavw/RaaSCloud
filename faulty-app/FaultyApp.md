# Faulty IoT App for RaaS Testing

This intentionally faulty app is designed to test the fault detection and recovery capabilities of RaaSwithSORRIR.

## Features

- Random crashes (20%)
- Delayed responses (30%)
- Simulated memory leaks (50%)
- Health check endpoint (`/health`)
- Fault simulation endpoint (`/simulate`)

## Usage

### 1. Build and run

```bash
docker-compose up --build
```
## Sample output
```sh
Attaching to faulty-app
faulty-app    | Faulty IoT App running on http://localhost:3000
faulty-app    | 🐢 Leaky success...
faulty-app    | 🐢 Leaky success...
faulty-app    | 🐢 Leaky success...
faulty-app    | 🐢 Delaying...
faulty-app    | 🐢 Leaky success...
faulty-app    | 🐢 Delaying...
faulty-app    | 🐢 Delaying...
faulty-app    | 🐢 Leaky success...
faulty-app    | 🐢 Leaky success...
faulty-app    | 🐢 Leaky success...
faulty-app    | 💥 Crashing...
faulty-app exited with code 1
```
