CREATE TABLE IF NOT EXISTS salons (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    name_norm VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    address_norm VARCHAR(500) NOT NULL,
    street_number VARCHAR(50),
    district VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    postcode VARCHAR(20) NOT NULL,
    phone VARCHAR(30),
    website VARCHAR(500),
    rating DECIMAL(2,1),
    review_count INTEGER DEFAULT 0,
    price_range VARCHAR(20),
    lat DOUBLE,
    lng DOUBLE,
    image_url VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (name_norm, address_norm)
);

CREATE TABLE IF NOT EXISTS services (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS salon_services (
    salon_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,
    PRIMARY KEY (salon_id, service_id),
    FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);
