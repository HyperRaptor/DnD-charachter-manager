-- Drop existing tables
DROP TABLE IF EXISTS species_traits CASCADE;
DROP TABLE IF EXISTS trait CASCADE;
DROP TABLE IF EXISTS character CASCADE;
DROP TABLE IF EXISTS species CASCADE;

-- Reset sequences if any
-- Note: PostgreSQL doesn't need this as it uses UUIDs 