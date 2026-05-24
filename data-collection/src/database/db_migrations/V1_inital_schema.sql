-- Salons table
CREATE TABLE salons (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(255) NOT NULL,
  name_norm     VARCHAR(255) NOT NULL,
  address       VARCHAR(500) NOT NULL,
  address_norm  VARCHAR(500) NOT NULL,
  street_number VARCHAR(50),
  district      VARCHAR(100) NOT NULL,
  city          VARCHAR(100) NOT NULL,
  country       VARCHAR(100) NOT NULL,
  postcode      VARCHAR(20) NOT NULL,
  phone         VARCHAR(30),
  website       VARCHAR(500),
  rating        DECIMAL(2,1),
  review_count  INTEGER DEFAULT 0,
  price_range   VARCHAR(20),
  lat           DOUBLE PRECISION,
  lng           DOUBLE PRECISION,
  image_url     VARCHAR(1000),
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW(),
  UNIQUE (name_norm, address_norm)
);

-- Services table
CREATE TABLE services (
  id   SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Join table
CREATE TABLE salon_services (
  salon_id   BIGINT NOT NULL REFERENCES salons(id) ON DELETE CASCADE,
  service_id BIGINT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  PRIMARY KEY (salon_id, service_id)
);
