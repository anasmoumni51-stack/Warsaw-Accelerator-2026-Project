# Salon API

A RESTful API for managing beauty salon data in Warsaw. Built with Spring Boot 4.0.6 and PostgreSQL.

## Project Structure

```
salonapi/
├── src/
│   ├── main/
│   │   ├── java/com/salons/warsaw/
│   │   │   ├── SalonApiApplication.java          # Spring Boot entry point
│   │   │   ├── config/
│   │   │   │   └── CorsConfig.java                # CORS configuration
│   │   │   ├── controller/
│   │   │   │   └── SalonController.java           # REST endpoints
│   │   │   ├── dto/
│   │   │   │   ├── SalonResponse.java             # Response DTO
│   │   │   │   └── SalonUpdateRequest.java        # Update request DTO
│   │   │   ├── entity/
│   │   │   │   ├── Salon.java                     # Salon entity
│   │   │   │   └── Service.java                   # Service entity
│   │   │   ├── repository/
│   │   │   │   ├── SalonRepository.java           # Salon data access
│   │   │   │   └── ServiceRepository.java         # Service data access
│   │   │   └── service/
│   │   │       └── SalonService.java              # Business logic
│   │   └── resources/
│   │       ├── application.properties             # Dev config (H2)
│   │       └── application-prod.yaml              # Prod config (PostgreSQL)
│   └── test/
│       └── java/com/salons/warsaw/
│           └── SalonApiApplicationTests.java      # Integration tests
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
- **API Documentation**: SpringDoc OpenAPI 3.0.2
- **Validation**: Jakarta Bean Validation
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
   git clone <repository-url>
   cd salonapi
   ```

2. **Run with default H2 database**
   ```bash
   ./mvnw spring-boot:run
   ```

3. **Access the API**
   - API: `http://localhost:8080/v1/salons`
   - Swagger UI: `http://localhost:8080/swagger-ui.html`
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
   - Swagger UI: `http://localhost:8080/swagger-ui.html`

3. **Stop the container**
   ```bash
   docker compose -f docker-compose-dev.yml down
   ```

### Option 3: Run with Docker (Production)

1. **Create a `.env` file**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your RDS credentials**
   ```env
   DATABASE_URL=jdbc:postgresql://your-rds-host:5432/salondb
   DATABASE_USERNAME=your_username
   DATABASE_PASSWORD=your_password
   CORS_ORIGIN=https://your-frontend-domain.com
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

### Option 4: Build JAR and run manually

1. **Build the JAR**
   ```bash
   ./mvnw clean package -DskipTests
   ```

2. **Run the JAR**
   ```bash
   java -jar target/salonapi-0.0.1-SNAPSHOT.jar
   ```

3. **Run with production profile**
   ```bash
   export SPRING_PROFILES_ACTIVE=prod
   export DATABASE_URL=jdbc:postgresql://your-host:5432/salondb
   export DATABASE_USERNAME=your_username
   export DATABASE_PASSWORD=your_password
   java -jar target/salonapi-0.0.1-SNAPSHOT.jar
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
┌──────────────┐         ┌──────────────────────┐         ┌──────────────┐
│    salons    │         │   salon_services     │         │   services   │
├──────────────┤         ├──────────────────────┤         ├──────────────┤
│ id (PK)      │─┐       │ salon_id (FK)        │      ┌──│ id (PK)      │
│ name         │ └────→  │ service_id (FK)      │ ←────┘  │ name         │
│ name_norm    │         └──────────────────────┘         └──────────────┘
│ address      │
│ address_norm │
│ street_number│
│ district     │
│ city         │
│ country      │
│ postcode     │
│ phone        │
│ website      │
│ rating       │
│ review_count │
│ price_range  │
│ lat          │
│ lng          │
│ image_url    │
│ created_at   │
│ updated_at   │
└──────────────┘
```

- **salons** table maps to `SalonEntity`
- **services** table maps to `ServiceEntity`
- **salon_services** is the JPA join table used for assignments
- **Unique Constraint:** `(name_norm, address_norm)` prevents duplicate salons

## Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SPRING_PROFILES_ACTIVE` | Spring profile (`dev` or `prod`) | `dev` | No |
| `DATABASE_URL` | JDBC connection string | `jdbc:h2:mem:salondb` | Prod only |
| `DATABASE_USERNAME` | Database username | `test` | Prod only |
| `DATABASE_PASSWORD` | Database password | `testtest` | Prod only |
| `CORS_ORIGIN` | Allowed CORS origins | `*` | No |

See `.env.example` for a template file.

## Error Handling

The API uses standard HTTP status codes:

- `200 OK`: Request successful
- `400 Bad Request`: Invalid input or validation error
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

## Testing

Run the test suite:

```bash
./mvnw test
```

## CORS Configuration

CORS origins are configured via the `CORS_ORIGIN` environment variable:

- **Development**: Defaults to `*` (allows all origins)
- **Production**: Set to your frontend domain (e.g., `https://salons.technicaltask.live`)

The configuration is in `CorsConfig.java` and reads from `application-prod.yaml` in production.

## License

This project is part of the Warsaw Beauty Salon Explorer application.
