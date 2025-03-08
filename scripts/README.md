# Database Migration Scripts

This directory contains SQL scripts for setting up and migrating the Supabase database.

## Available Scripts

- `setup-supabase.sql`: Initial setup script for creating tables and inserting sample data
- `migrate-apartment-to-discord.sql`: Migration script for renaming the "apartment" column to "discord_name"

## How to Apply the Migration

To migrate from "apartment" to "discord_name" without losing data, follow these steps:

1. Connect to your Supabase database using the SQL Editor in the Supabase Dashboard
2. Run the `migrate-apartment-to-discord.sql` script
3. The script will:
   - Add a new "discord_name" column
   - Copy data from "apartment" to "discord_name"
   - Make "discord_name" NOT NULL
   - Create a backward-compatible view

## Backward Compatibility

The migration is designed to maintain backward compatibility:

1. The original "apartment" column is preserved for now
2. A view called "users_legacy" is created for any code that still expects the old schema
3. The client-side code has been updated to handle both field names

## Future Cleanup

Once all code has been updated to use "discord_name" instead of "apartment", you can run the following SQL to remove the old column:

```sql
-- Only run this after confirming all code uses discord_name
ALTER TABLE users DROP COLUMN apartment;
DROP VIEW IF EXISTS users_legacy;
``` 