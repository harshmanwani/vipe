-- Migration script to rename apartment column to discord_name
-- This script preserves existing data and provides backward compatibility

-- 1. Add the new discord_name column
ALTER TABLE users ADD COLUMN IF NOT EXISTS discord_name TEXT;

-- 2. Copy data from apartment to discord_name
UPDATE users SET discord_name = apartment WHERE discord_name IS NULL;

-- 3. Make discord_name NOT NULL after data is copied
ALTER TABLE users ALTER COLUMN discord_name SET NOT NULL;

-- 4. Create a view for backward compatibility (optional)
CREATE OR REPLACE VIEW users_legacy AS
SELECT id, username, password, discord_name AS apartment, role, created_at
FROM users;

-- Note: We're keeping the apartment column for now to ensure backward compatibility
-- In a future migration, once all code is updated, we can remove the apartment column 