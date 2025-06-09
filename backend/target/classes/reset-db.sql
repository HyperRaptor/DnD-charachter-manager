-- Drop existing tables
DROP TABLE IF EXISTS species_traits CASCADE;
DROP TABLE IF EXISTS trait CASCADE;
DROP TABLE IF EXISTS character CASCADE;
DROP TABLE IF EXISTS species CASCADE;

-- Reset sequences if any
-- Note: PostgreSQL doesn't need this as it uses UUIDs 

-- Create character table with inventory columns
CREATE TABLE character (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    species_id UUID NOT NULL,
    background_id UUID NOT NULL,
    class_id UUID NOT NULL,
    level INTEGER NOT NULL DEFAULT 1,
    temporary_hp INTEGER NOT NULL DEFAULT 0,
    current_hp INTEGER NOT NULL DEFAULT 0,
    max_hp INTEGER NOT NULL DEFAULT 0,
    speed INTEGER NOT NULL DEFAULT 0,
    strength INTEGER NOT NULL DEFAULT 0,
    dexterity INTEGER NOT NULL DEFAULT 0,
    constitution INTEGER NOT NULL DEFAULT 0,
    intelligence INTEGER NOT NULL DEFAULT 0,
    wisdom INTEGER NOT NULL DEFAULT 0,
    charisma INTEGER NOT NULL DEFAULT 0,
    coins TEXT DEFAULT '{"platinum":0,"gold":0,"electrum":0,"silver":0,"copper":0}',
    items TEXT DEFAULT '[]',
    details TEXT DEFAULT '{"background":"","classFeatures":"","speciesFeatures":"","otherFeatures":"","notes":"","connections":""}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 