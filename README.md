# Weafy

A water monitoring system developed for SDU Hackathon 2024. The system consists
of a backend service for data management and a mobile app for device monitoring
and control.

<div style="display: flex; justify-content: space-between; margin: 20px 0;">
    <img src="docs/preview-1.png" width="32%" alt="Preview 1" />
    <img src="docs/preview-2.png" width="32%" alt="Preview 2" />
    <img src="docs/preview-3.png" width="32%" alt="Preview 3" />
</div>

## Project Structure

The project is organized as a monorepo with the following packages:

- `packages/backend`: Express.js backend service
- `packages/mobile`: React Native mobile application
- `packages/config`: Shared configuration and Prisma schema

## Features

- Device management (PLANT and OXYGEN sensors)
- Real-time monitoring of water quality metrics
- QR code-based device registration
- Location-based device tracking
- Secure API authentication
- Data logging and history

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Expo CLI (for mobile development)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd weafy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start PostgreSQL database container:
   ```bash
   docker run --name weafy-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=weafy -p 5432:5432 -d postgres:16

   ```

4. Set up environment variables:

   Backend (.env):
   ```env
   SERVICE_API_KEY=your_api_key
   PORT=3000
   ```

   Config (.env):
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/weafy
   ```

   Mobile (.env):
   ```env
   EXPO_PUBLIC_SERVICE_API_URL=your_backend_url
   EXPO_PUBLIC_SERVICE_API_KEY=your_api_key
   EXPO_USE_METRO_WORKSPACE_ROOT=1
   ```

5. Initialize the database:
   ```bash
   cd packages/config && npx prisma migrate dev && cd ../..
   ```

6. Start the development servers:

   Global:
   ```bash
   npm run dev
   ```

   Or individually:

   Backend:
   ```bash
   cd packages/backend
   npm run dev
   ```

   Mobile:
   ```bash
   cd packages/mobile
   npm start
   ```

## API Documentation

### Devices

- `GET /api/devices`: Get all devices
- `GET /api/devices/:id`: Get a specific device
- `POST /api/devices`: Register a new device
- `PUT /api/devices/:id`: Update device information
- `DELETE /api/devices/:id`: Remove a device

### Data Ingress

- `POST /api/ingress/plant`: Submit plant sensor data
- `POST /api/ingress/oxygen`: Submit oxygen sensor data

### Data Egress

- `GET /api/egress/plant`: Retrieve plant sensor data (paginated)
- `GET /api/egress/oxygen`: Retrieve oxygen sensor data (paginated)

## Mobile App

The mobile application provides the following features:

- Device registration via QR code scanning
- Real-time device monitoring
- Location-based device mapping
- Device management interface

## Authentication

All API endpoints are protected with API key authentication. Include the API key
in the request headers:

```http
Authorization: your_api_key
```

## Database Schema

The system uses PostgreSQL with Prisma as the ORM. Key models include:

- Device: Base device information
- PlantDeviceRecord: Plant sensor measurements
- OxygenDeviceRecord: Oxygen sensor measurements
- Log: System logging
- GenericDeviceRecord: Generic device data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for
details.
