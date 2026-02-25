-- Force location column to TEXT
ALTER TABLE properties
ALTER COLUMN location TYPE TEXT
USING location::text;
