-- Services
INSERT INTO services (name) VALUES ('Hair Styling');
INSERT INTO services (name) VALUES ('Beauty Treatment');
INSERT INTO services (name) VALUES ('Nail Care');
INSERT INTO services (name) VALUES ('Skin Care');
INSERT INTO services (name) VALUES ('Barber');
INSERT INTO services (name) VALUES ('Makeup');

-- Salons
INSERT INTO salons (name, name_norm, address, address_norm, street_number, district, city, country, postcode, phone, website, price_range, rating, review_count, lat, lng, image_url)
VALUES ('Bella Visage', 'bella visage', 'ul. Marszałkowska', 'ul. marszałkowska', '0', 'Śródmieście', 'Warszawa', 'Poland', '00-000', '+48 22 222 0000', 'https://bellavisage.pl', 'zł zł', 4.8, 156, 52.2297, 21.0122, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');

INSERT INTO salons (name, name_norm, address, address_norm, street_number, district, city, country, postcode, phone, website, price_range, rating, review_count, lat, lng, image_url)
VALUES ('Glamour Studio', 'glamour studio', 'ul. Nowy Świat', 'ul. nowy świat', '0', 'Śródmieście', 'Warszawa', 'Poland', '00-000', '+48 22 222 5566', 'https://glamourstudio.pl', 'zł zł zł', 4.9, 230, 52.2310, 21.0200, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');

INSERT INTO salons (name, name_norm, address, address_norm, street_number, district, city, country, postcode, phone, website, price_range, rating, review_count, lat, lng, image_url)
VALUES ('Hair Point', 'hair point', 'ul. Puławska', 'ul. puławska', '0', 'Mokotów', 'Warszawa', 'Poland', '02-000', '+48 22 222 8899', 'https://hairpoint.pl', 'zł', 4.2, 89, 52.1950, 21.0100, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');

INSERT INTO salons (name, name_norm, address, address_norm, street_number, district, city, country, postcode, phone, website, price_range, rating, review_count, lat, lng, image_url)
VALUES ('Nails & Beauty', 'nails & beauty', 'ul. Wilcza', 'ul. wilcza', '0', 'Śródmieście', 'Warszawa', 'Poland', '00-000', '+48 22 222 4455', 'https://nailsbeauty.pl', 'zł zł', 4.5, 102, 52.2260, 21.0150, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');

INSERT INTO salons (name, name_norm, address, address_norm, street_number, district, city, country, postcode, phone, website, price_range, rating, review_count, lat, lng, image_url)
VALUES ('SPA Relax', 'spa relax', 'ul. Złota', 'ul. złota', '0', 'Wola', 'Warszawa', 'Poland', '00-000', '+48 22 222 7788', 'https://sparelax.pl', 'zł zł zł', 4.7, 198, 52.2330, 21.0050, 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80');

-- Salon-Service relationships
INSERT INTO salon_services (salon_id, service_id) VALUES (1, 1);
INSERT INTO salon_services (salon_id, service_id) VALUES (1, 2);
INSERT INTO salon_services (salon_id, service_id) VALUES (1, 6);
INSERT INTO salon_services (salon_id, service_id) VALUES (2, 1);
INSERT INTO salon_services (salon_id, service_id) VALUES (2, 2);
INSERT INTO salon_services (salon_id, service_id) VALUES (2, 6);
INSERT INTO salon_services (salon_id, service_id) VALUES (3, 1);
INSERT INTO salon_services (salon_id, service_id) VALUES (3, 5);
INSERT INTO salon_services (salon_id, service_id) VALUES (4, 3);
INSERT INTO salon_services (salon_id, service_id) VALUES (4, 4);
INSERT INTO salon_services (salon_id, service_id) VALUES (5, 2);
INSERT INTO salon_services (salon_id, service_id) VALUES (5, 4);
