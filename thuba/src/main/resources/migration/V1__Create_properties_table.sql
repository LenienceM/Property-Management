CREATE TABLE properties (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    location VARCHAR(255),
    bedrooms INT,
    bathrooms INT,
    description VARCHAR(2000)
);


