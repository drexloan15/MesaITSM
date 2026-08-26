# MesaITSM

Plataforma de gestión de servicios de TI construida como un monorepo de microservicios. Centraliza la autenticación y los flujos de incidentes, problemas y cambios, con una interfaz web para la operación diaria.

![Node.js](https://img.shields.io/badge/Node.js-20-5FA04E?logo=node.js&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=111827)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)

> [!NOTE]
> El proyecto se encuentra en desarrollo. La autenticación, el dashboard y la gestión de incidentes ya tienen interfaz funcional. Los servicios de problemas y cambios están implementados en el backend, pero sus pantallas todavía son vistas provisionales.

## Funcionalidades

- Autenticación con access token y refresh token mediante JWT.
- Control de acceso basado en usuarios, roles y permisos.
- Gestión de incidentes con filtros, comentarios y eliminación lógica.
- Cálculo de vencimientos y detección de incumplimientos de SLA.
- Procesamiento asíncrono de incidentes con Bull y Redis.
- Gestión de problemas, causa raíz, solución temporal y resolución.
- Gestión de solicitudes de cambio (RFC), aprobaciones y entregas.
- Respuestas y errores normalizados mediante interceptores y filtros globales.
- Validación de DTOs con `class-validator`.
- Documentación OpenAPI independiente para cada servicio.
- Entorno de infraestructura reproducible con Docker Compose.

## Arquitectura

```mermaid
flowchart LR
    UI[React + Vite<br/>:3000]

    subgraph API[Microservicios NestJS]
      AUTH[Auth<br/>:3001]
      INC[Incidentes<br/>:3002]
      PRB[Problemas<br/>:3003]
      CHG[Cambios<br/>:3004]
    end

    UI --> AUTH
    UI --> INC
    UI -. integración pendiente .-> PRB
    UI -. integración pendiente .-> CHG

    AUTH --> DB[(PostgreSQL 16)]
    INC --> DB
    PRB --> DB
    CHG --> DB
    INC --> REDIS[(Redis 7)]
```

Los servicios comparten una base PostgreSQL, pero mantienen módulos, configuración y cliente Prisma propios. Docker Compose también aprovisiona Elasticsearch, RabbitMQ y HashiCorp Vault para la evolución de la plataforma.

## Tecnologías

| Capa | Tecnologías |
| --- | --- |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Zustand, TanStack Query, React Hook Form, Zod |
| Backend | NestJS 10, Prisma 5, Passport, JWT, Swagger |
| Datos y colas | PostgreSQL 16, Redis 7, Bull |
| Infraestructura disponible | Docker Compose, Elasticsearch 8, RabbitMQ 3, HashiCorp Vault 1.15 |

## Estructura del repositorio

```text
MesaITSM/
├── frontend/                    Aplicación React
├── services/
│   ├── auth-service/            Identidad, sesiones y permisos
│   ├── incidents-service/       Incidentes, categorías, SLA y colas
│   ├── problems-service/        Problemas y análisis de causa raíz
│   └── changes-service/         RFC, aprobaciones y entregas
├── docker-compose.yml           Servicios de infraestructura local
├── package.json                 Workspaces del backend
└── start-all.ps1                Inicio de servicios en Windows
```

## Requisitos

- Node.js 20 o superior.
- npm 10 o superior.
- Docker Desktop o Docker Engine con Compose.

## Instalación

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/drexloan15/MesaITSM.git
cd MesaITSM
npm install
npm --prefix frontend install
```

### 2. Levantar la infraestructura

```bash
docker compose up -d
```

Esto inicia PostgreSQL, Redis, Elasticsearch, RabbitMQ y Vault. Las credenciales incluidas en `docker-compose.yml` están pensadas únicamente para desarrollo local.

### 3. Configurar variables de entorno

Copia el archivo `.env.example` de cada servicio como `.env`:

```text
services/auth-service/.env.example       → services/auth-service/.env
services/incidents-service/.env.example  → services/incidents-service/.env
services/problems-service/.env.example   → services/problems-service/.env
services/changes-service/.env.example    → services/changes-service/.env
frontend/.env.example                    → frontend/.env
```

Usa la misma clave `JWT_SECRET` en todos los microservicios. Con la configuración local incluida en Docker Compose, la conexión de PostgreSQL es:

```env
DATABASE_URL="postgresql://admin:admin_password@localhost:5432/comutel_itsm?schema=public"
```

Reemplaza los secretos de ejemplo antes de utilizar el proyecto fuera de un entorno local.

### 4. Preparar la base de datos

El esquema de `changes-service` contiene el modelo completo de la plataforma. Aplícalo y luego genera el cliente Prisma de cada servicio:

```bash
npm run prisma:push --workspace=changes-service
npm run prisma:generate --workspace=auth-service
npm run prisma:generate --workspace=incidents-service
npm run prisma:generate --workspace=problems-service
npm run prisma:generate --workspace=changes-service
```

### 5. Iniciar la aplicación

Ejecuta cada proceso en una terminal diferente:

```bash
npm run dev --workspace=auth-service
npm run dev --workspace=incidents-service
npm run dev --workspace=problems-service
npm run dev --workspace=changes-service
npm --prefix frontend run dev
```

Abre `http://localhost:3000` para utilizar la aplicación.

## Puertos y documentación

| Componente | URL | Swagger |
| --- | --- | --- |
| Frontend | `http://localhost:3000` | — |
| Auth service | `http://localhost:3001/api/v1` | `http://localhost:3001/api/docs` |
| Incidents service | `http://localhost:3002/api/v1` | `http://localhost:3002/api/docs` |
| Problems service | `http://localhost:3003/api/v1` | `http://localhost:3003/api/docs` |
| Changes service | `http://localhost:3004/api/v1` | `http://localhost:3004/api/docs` |
| RabbitMQ Management | `http://localhost:15672` | — |
| Elasticsearch | `http://localhost:9200` | — |
| Vault | `http://localhost:8200` | — |

## Endpoints principales

- `POST /api/v1/auth/register`, `/login` y `/refresh`.
- `GET /api/v1/auth/me`.
- CRUD de `/api/v1/incidents` y consulta de `/incidents/stats`.
- `GET /api/v1/categories`.
- CRUD de `/api/v1/problems` y consulta de `/problems/stats`.
- CRUD de `/api/v1/changes` y consulta de `/changes/stats`.
- Gestión de entregas mediante `/api/v1/changes/:id/deliveries`.

Consulta Swagger para ver los DTOs, filtros, respuestas y requisitos de autenticación de cada operación.

## Scripts útiles

```bash
npm run build                   # Compila los workspaces del backend
npm run dev --workspaces        # Inicia los servicios backend en modo watch
npm --prefix frontend run build # Valida y compila el frontend
docker compose down             # Detiene la infraestructura
```

## Autor

Desarrollado por [Jean Puccio](https://github.com/drexloan15).
