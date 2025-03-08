# Apartment to Discord Name Migration

This document outlines the changes made to migrate from using "apartment" to "discord_name" throughout the application.

## Database Changes

1. **Added New Column**
   - Added `discord_name` column to the `users` table
   - Copied existing data from `apartment` to `discord_name`
   - Made `discord_name` NOT NULL after data migration

2. **Backward Compatibility**
   - Kept the original `apartment` column for backward compatibility
   - Created a view `users_legacy` for code that still expects the old schema

## Code Changes

1. **Created Utility Functions**
   - Added `normalizeUserData()` to ensure both field names are available
   - Added `getDisplayName()` to get the appropriate display name

2. **Updated Components**
   - Updated Header components to use the new utility functions
   - Updated user data handling to normalize data

3. **Updated Data Access**
   - Modified database access functions to use the new field name
   - Ensured all functions return normalized data

## How to Apply the Migration

1. Run the migration script in the Supabase SQL Editor:
   ```
   scripts/migrate-apartment-to-discord.sql
   ```

2. Deploy the updated code that includes the utility functions and component changes

## Future Cleanup

Once all code has been updated and tested, you can remove the old column:

```sql
ALTER TABLE users DROP COLUMN apartment;
DROP VIEW IF EXISTS users_legacy;
```

## Testing

After applying the migration, test the following:

1. **Existing Users**
   - Existing users should see their apartment number displayed as Discord name
   - User profiles should load correctly

2. **New Users**
   - New user signup should work with Discord name
   - New users should see their Discord name displayed correctly

3. **API Functionality**
   - All API calls involving user data should work correctly 