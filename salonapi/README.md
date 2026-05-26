# Salon API

A RESTful API for managing beauty salon data in Warsaw. Built with Spring Boot 4.0.6 and PostgreSQL.

## Project Structure

```text
salonapi/
├── src/
│   ├── main/
│   │   ├── java/com/sumup/moumni/salonapi/
│   │   │   ├── SalonapiApplication.java           # Spring Boot entry point
│   │   │   ├── Common/
│   │   │   │   ├── CorsConfig.java                # CORS configuration
│   │   │   │   ├── ErrorDto.java                  # Error response DTO
│   │   │   │   ├── GlobalExceptionHandler.java    # Centralized exception handling
│   │   │   │   └── Exception/
│   │   │   │       └── SalonNotFoundException.java
│   │   │   ├── Controller/
│   │   │   │   └── SalonController.java           # REST endpoints
│   │   │   ├── Dto/
│   │   │   │   ├── PageableDTO.java               # Pagination & sort validation
│   │   │   │   ├── SalonDetailDTO.java            # Full salon details (GET /{id})
│   │   │   │   ├── SalonFilterDTO.java            # Filter query params (district, service)
│   │   │   │   ├── SalonSummaryDTO.java           # List view (GET /salons)
│   │   │   │   └── SalonUpdateDTO.java            # Update request (PUT /{id})
│   │   │   ├── Entity/
│   │   │   │   ├── Salon.java                     # Salon JPA entity
│   │   │   │   └── Services.java                  # Service JPA entity
│   │   │   ├── Mapper/
│   │   │   │   └── SalonMapper.java               # MapStruct entity ↔ DTO mapping
│   │   │   ├── Repository/
│   │   │   │   ├── SalonRepository.java           # Salon data access
│   │   │   │   └── ServiceRepository.java         # Service data access
│   │   │   └── Service/
│   │   │       └── SalonService.java              # Business logic
│   │   └── resources/
│   │       ├── application.properties             # Dev config (H2)
│   │       ├── application-prod.yaml              # Prod config (PostgreSQL)
│   │       └── H2.migration/
│   │           ├── schema.sql                     # H2 database schema
│   │           └── data.sql                       # Seed data for local dev
│   └── test/
│       └── java/com/sumup/moumni/salonapi/
│           ├── SalonapiApplicationTests.java      # Context load test
│           ├── Controller/
│           │   └── SalonControllerTest.java       # Controller unit tests (Mockito)
│           └── Service/
│               └── SalonServiceTest.java          # Service unit tests (Mockito)
├── Dockerfile                                     # Multi-stage Docker build
├── docker-compose-prod.yml                        # Production: app only (RDS external)
├── docker-compose-dev.yml                         # Development: app with H2
├── .env.example                                   # Environment variable template
├── .dockerignore                                  # Docker build exclusions
└── pom.xml                                        # Maven dependencies
```

## Stack & Overview

- **Framework**: Spring Boot 4.0.6
- **Java**: 21
- **Database**: PostgreSQL (production) / H2 (development)
- **ORM**: Spring Data JPA with Hibernate
- **Mapping**: MapStruct 1.6.3 (entity ↔ DTO)
- **Validation**: Jakarta Bean Validation
- **API Documentation**: SpringDoc OpenAPI 3.0.2
- **Utilities**: Lombok 1.18.46
- **Build Tool**: Maven
- **Containerization**: Docker (multi-stage build)

## Features

- RESTful API with pagination, filtering, and sorting
- Swagger/OpenAPI documentation
- Multi-environment configuration (dev/prod)
- CORS support with configurable origins
- Input validation with Jakarta Bean Validation
- Docker containerization
- In-memory H2 for development, PostgreSQL for production


## Quick Start

### Option 1: Run with Maven (Local Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/anasmoumni51-stack/Warsaw-Accelerator-2026-Project
   cd salonapi
   ```

2. **Run with default H2 database**
   ```bash
   ./mvnw spring-boot:run
   ```
   The app starts with an in-memory H2 database pre seeded with 5 sample salons and 6 services. No additional setup required.

3. **Access the API And Test the API**
   - API: `http://localhost:8080/v1/salons`
   - Swagger UI: `http://localhost:8080/swagger`
   - H2 Console: `http://localhost:8080/h2-console`
     - JDBC URL: `jdbc:h2:mem:salondb`
     - Username: `test`
     - Password: `testtest`

### Option 2: Run with Docker (Development)

1. **Build and run the app container**
   ```bash
   docker compose -f docker-compose-dev.yml up --build
   ```

2. **Access the API**
   - API: `http://localhost:8080/v1/salons`
   - Swagger UI: `http://localhost:8080/swagger`

3. **Stop the container**
   ```bash
   docker compose -f docker-compose-dev.yml down
   ```

### Option 3: Run with Docker (Production)

1. **Create a `.env` file**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your postgreSQL credentials**
   ```env
   DATABASE_URL=jdbc:postgresql://your-rds-host:5432/salondb
   DATABASE_USERNAME=your_db_user
   DATABASE_PASSWORD=your_db_password
   CORS_ORIGIN=https://your-frontend-domain.com
   PORT=8080
   ```

3. **Build and run the production container**
   ```bash
   docker compose -f docker-compose-prod.yml up --build -d
   ```

4. **Check logs**
   ```bash
   docker compose -f docker-compose-prod.yml logs -f
   ```

5. **Stop the container**
   ```bash
   docker compose -f docker-compose-prod.yml down
   ```


## REST API Endpoints

### Salons
- `GET /v1/salons` - Retrieve all salons (paginated: ?page=0&size=20)
- `GET /v1/salons?district={district}&service={service}` - Filter by district or service and both
- `GET /v1/salons?sort={field}&orderBy={ASC|DESC}` - Sort salons (fields: rating, priceRange, name, reviewCount)
- `GET /v1/salons/{id}` - Retrieve one salon with full details
- `PUT /v1/salons/{id}` - Update a salon with all input fields

**Query Parameters:**
- `page` (optional): Page number (0-indexed, default: 0)
- `size` (optional): Page size (default: 20, max: 100)
- `district` (optional): Filter by Warsaw district name
- `service` (optional): Filter by service type (e.g., "Hair Styling", "Nail Care")
- `sort` (optional): Sort field (rating, priceRange, name, reviewCount)
- `orderBy` (optional): Sort direction (ASC, DESC, default: DESC)

**Example Requests:**
```bash
# Get all salons
GET /v1/salons?page=0&size=20

# Filter by district
GET /v1/salons?district=Śródmieście

# Filter by service
GET /v1/salons?service=Hair%20Styling

# Filter by both district and service
GET /v1/salons?district=Śródmieście&service=Hair%20Styling

# Sort by rating (highest first)
GET /v1/salons?sort=rating&orderBy=DESC

# Combine pagination, filtering, and sorting
GET /v1/salons?district=Śródmieście&sort=rating&orderBy=DESC&page=0&size=10
```

## Data Model

**Design Decision:** Many-to-many relationship, a salon can offer multiple services.

```
┌──────────────────┐         ┌──────────────────────┐         ┌──────────────┐
│     salons       │         │   salon_services     │         │   services   │
├──────────────────┤         ├──────────────────────┤         ├──────────────┤
│ id (PK)          │─┐       │ salon_id (FK)        │      ┌──│ id (PK)      │
│ name             │ └────→  │ service_id (FK)      │ ←────┘  │ name         │
│ name_norm (RO)   │         └──────────────────────┘         └──────────────┘
│ address          │
│ address_norm (RO)│
│ street_number    │
│ district         │
│ city             │
│ country          │
│ postcode         │
│ phone            │
│ website          │
│ rating           │
│ review_count     │
│ price_range      │
│ lat              │
│ lng              │
│ image_url        │
│ created_at       │
│ updated_at       │
└──────────────────┘

(RO) = read-only, populated by database/pipeline, not mapped for updates
```

- **salons** table maps to `Salon` entity
- **services** table maps to `Services` entity
- **salon_services** is the JPA join table used for many-to-many assignment
- **Unique Constraint:** `(name_norm, address_norm)` prevents duplicate salons
- **@EntityGraph:** Used on `findById` to eagerly fetch services in a single query
- **@BatchSize:** Used on the `services` entity field to batch-load collections for list queries (avoids N+1)

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SPRING_PROFILES_ACTIVE` | Spring profile (`dev` or `prod`) | `dev` | No |
| `DATABASE_URL` | JDBC connection string | `jdbc:h2:mem:salondb` | Prod only |
| `DATABASE_USERNAME` | Database username | `test` | Prod only |
| `DATABASE_PASSWORD` | Database password | `testtest` | Prod only |
| `CORS_ORIGIN` | Allowed CORS origins | `*` | No |
| `PORT` | Server port | `8080` | No |

In dev mode, H2 is configured directly in `application.properties` (no env vars needed).

## Error Handling

The API uses standard HTTP status codes:

| Status | When | Response format |
|--------|------|-----------------|
| `200 OK` | Request successful | Requested resource |
| `400 Bad Request` | Validation error on request body | `Map<String, String>` with field-level errors |
| `400 Bad Request` | Invalid query parameters | `ErrorDto` with error message |
| `400 Bad Request` | Wrong parameter type (e.g. `?page=abc`) | `ErrorDto` with error message |
| `404 Not Found` | Salon not found or non-existent endpoint | `ErrorDto` with error message |
| `405 Method Not Allowed` | Wrong HTTP method (e.g. POST on GET-only endpoint) | `ErrorDto` with error message |
| `409 Conflict` | Duplicate constraint violation (name + address) | `ErrorDto` with conflict message |
| `500 Internal Server Error` | Unexpected server error | `Map<String, Object>` with status, error, path |

## Testing

Run the test suite:

```bash
./mvnw test
```

## CORS Configuration

CORS origins are configured via the `app.cors.origin` property, driven by the `CORS_ORIGIN` environment variable in production:

- **Development**: Defaults to `*` (allows all origins)
- **Production**: Set to your frontend domain (e.g., `https://salon-ui.technical-task.live`)

The configuration is in `Common/CorsConfig.java` and reads `app.cors.origin` from the active Spring profile.
