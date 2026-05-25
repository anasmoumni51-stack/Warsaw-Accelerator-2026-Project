# Salon API

A RESTful API for managing beauty salon data in Warsaw. Built with Spring Boot 4.0.6 and PostgreSQL.

## Technology Stack

- **Framework**: Spring Boot 4.0.6
- **Java**: 21
- **Database**: PostgreSQL (production) / H2 (development)
- **ORM**: Spring Data JPA with Hibernate
- **API Documentation**: SpringDoc OpenAPI 3.0.2
- **Validation**: Jakarta Bean Validation
- **Build Tool**: Maven

## Getting Started

### Development Mode

The application runs with an in-memory H2 database by default:

```bash
./mvnw spring-boot:run
```

Access the H2 console at `http://localhost:8080/h2-console`:
- JDBC URL: `jdbc:h2:mem:salondb`
- Username: `test`
- Password: `testtest`

### Production Mode

Set the active profile and provide database credentials:

```bash
export SPRING_PROFILES_ACTIVE=prod
export DATABASE_URL=jdbc:postgresql://your-host:5432/salon_db
export DATABASE_USERNAME=your_username
export DATABASE_PASSWORD=your_password
export PORT=8080

./mvnw spring-boot:run
```

Or run the JAR:

```bash
./mvnw clean package
java -jar target/salonapi-0.0.1-SNAPSHOT.jar
```

## API Documentation

Once the application is running, access the interactive API documentation:

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI Spec**: `http://localhost:8080/v3/api-docs`

## API Endpoints

### Get All Salons

Retrieve a paginated list of salons with optional filtering.

**Endpoint**: `GET /v1/salons`

**Query Parameters**:
- `district` (optional): Filter by district name
- `service` (optional): Filter by service type
- `page` (optional): Page number (0-indexed, default: 0)
- `size` (optional): Page size (default: 20)
- `sort` (optional): Sort field and direction (e.g., `name,asc`)

**Example Request**:
```bash
curl -X GET "http://localhost:8080/v1/salons?district=Śródmieście&page=0&size=10"
```

**Example Response**:
```json
{
  "content": [
    {
      "id": 1,
      "name": "Beauty Studio",
      "district": "Śródmieście",
      "rating": 4.8,
      "priceRange": "zł zł",
      "imageUrl": "https://res.cloudinary.com/...",
      "lat": 52.2297,
      "lng": 21.0122,
      "services": ["Hair Styling", "Nail Care"],
      "reviewCount": 156
    }
  ],
  "pageable": {
    "pageNumber": 0,
    "pageSize": 10,
    "sort": {
      "empty": true,
      "sorted": false,
      "unsorted": true
    },
    "offset": 0,
    "paged": true,
    "unpaged": false
  },
  "last": false,
  "totalElements": 135,
  "totalPages": 14,
  "size": 10,
  "number": 0,
  "sort": {
    "empty": true,
    "sorted": false,
    "unsorted": true
  },
  "first": true,
  "numberOfElements": 10,
  "empty": false
}
```

### Get Salon by ID

Retrieve detailed information about a specific salon.

**Endpoint**: `GET /v1/salons/{id}`

**Path Parameters**:
- `id` (required): Salon ID

**Example Request**:
```bash
curl -X GET "http://localhost:8080/v1/salons/1"
```

**Example Response**:
```json
{
  "id": 1,
  "name": "Beauty Studio",
  "address": "Marszałkowska 1",
  "streetNumber": "1",
  "district": "Śródmieście",
  "city": "Warszawa",
  "country": "Poland",
  "postcode": "00-001",
  "phone": "+48 123 456 789",
  "website": "https://beautystudio.pl",
  "services": ["Hair Styling", "Nail Care", "Skin Care"],
  "priceRange": "zł zł",
  "rating": 4.8,
  "reviewCount": 156,
  "imageUrl": "https://res.cloudinary.com/...",
  "lat": 52.2297,
  "lng": 21.0122
}
```

**Error Response** (404):
```json
{
  "error": "Salon not found"
}
```

### Update Salon

Update an existing salon's information.

**Endpoint**: `PUT /v1/salons/{id}`

**Path Parameters**:
- `id` (required): Salon ID

**Request Body** (JSON):
```json
{
  "name": "Beauty Studio Plus",
  "address": "Marszałkowska 1",
  "district": "Śródmieście",
  "phone": "+48 123 456 789",
  "website": "https://beautystudio.pl",
  "rating": 4.9,
  "reviewCount": 160,
  "priceRange": "zł zł"
}
```

**Validation Rules**:
- `name`: Required, max 255 characters
- `address`: Required, max 500 characters
- `district`: Required
- `phone`: Required, max 30 characters
- `website`: Required, max 500 characters
- `rating`: Required, must be between 0 and 5
- `reviewCount`: Required, must be >= 0
- `priceRange`: Required

**Example Request**:
```bash
curl -X PUT "http://localhost:8080/v1/salons/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Beauty Studio Plus",
    "address": "Marszałkowska 1",
    "district": "Śródmieście",
    "phone": "+48 123 456 789",
    "website": "https://beautystudio.pl",
    "rating": 4.9,
    "reviewCount": 160,
    "priceRange": "zł zł"
  }'
```

**Example Response** (200):
```json
{
  "id": 1,
  "name": "Beauty Studio Plus",
  "address": "Marszałkowska 1",
  "streetNumber": "1",
  "district": "Śródmieście",
  "city": "Warszawa",
  "country": "Poland",
  "postcode": "00-001",
  "phone": "+48 123 456 789",
  "website": "https://beautystudio.pl",
  "services": ["Hair Styling", "Nail Care", "Skin Care"],
  "priceRange": "zł zł",
  "rating": 4.9,
  "reviewCount": 160,
  "imageUrl": "https://res.cloudinary.com/...",
  "lat": 52.2297,
  "lng": 21.0122
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input data (validation errors)
- `404 Not Found`: Salon not found

## Database Schema

### Salons Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing ID |
| name | VARCHAR(255) | NOT NULL | Salon name |
| name_norm | VARCHAR(255) | NOT NULL | Normalized name (lowercase) |
| address | VARCHAR(500) | NOT NULL | Full address |
| address_norm | VARCHAR(500) | NOT NULL | Normalized address |
| street_number | VARCHAR(50) | | Street number |
| district | VARCHAR(100) | NOT NULL | Warsaw district |
| city | VARCHAR(100) | NOT NULL | City name |
| country | VARCHAR(100) | NOT NULL | Country name |
| postcode | VARCHAR(20) | NOT NULL | Postal code |
| phone | VARCHAR(30) | | Phone number |
| website | VARCHAR(500) | | Website URL |
| rating | DECIMAL(2,1) | | Rating (0-5) |
| review_count | INTEGER | DEFAULT 0 | Number of reviews |
| price_range | VARCHAR(20) | | Price range (zł, zł zł, zł zł zł) |
| lat | DOUBLE PRECISION | | Latitude |
| lng | DOUBLE PRECISION | | Longitude |
| image_url | VARCHAR(1000) | | Image URL |
| created_at | TIMESTAMP | DEFAULT NOW() | Creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp |

**Unique Constraint**: `(name_norm, address_norm)`

### Services Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing ID |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Service name |

### Salon-Services Join Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| salon_id | BIGINT | FOREIGN KEY | References salons(id) |
| service_id | BIGINT | FOREIGN KEY | References services(id) |

**Primary Key**: `(salon_id, service_id)`

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

## Building for Production

Create a production-ready JAR:

```bash
./mvnw clean package -DskipTests
```

The JAR will be created in `target/salonapi-0.0.1-SNAPSHOT.jar`.

## CORS Configuration

CORS origins are configured via the `CORS_ORIGIN` environment variable:

- **Development**: Defaults to `*` (allows all origins)
- **Production**: Set to your frontend domain

```bash
export CORS_ORIGIN=https://your-frontend-domain.com
```

The configuration is in `CorsConfig.java` and reads from `application-prod.yaml` in production.

## License

This project is part of the Warsaw Beauty Salon Explorer application.