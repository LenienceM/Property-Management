-- Creating an index on the suburb column to optimize filter queries
CREATE INDEX idx_property_suburb ON properties (suburb);