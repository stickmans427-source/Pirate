# Security Spec

## Data Invariants
1. Users can only edit their own user profile.
2. Only the owner (stickmans427@gmail.com) can update all assets or user tokens.
3. Assets can be read by anyone.
4. Assets can only be created by authenticated users.
5. Assets can only be updated by their creator or the owner.
6. Assets can only be deleted by their creator or the owner.
7. Notifications can only be read by their intended user.

## The "Dirty Dozen" Payloads
1. User updating another user's profile.
2. Unauthenticated user creating an asset.
3. User modifying asset creatorId to someone else.
4. User updating an asset they don't own.
5. User deleting an asset they don't own.
6. User putting an invalid ID.
7. Missing required fields in asset payload.
8. Incorrect types in payload.
9. Modifying a user's tokens as a regular user.
10. Reading another user's notifications.
11. PII exposure in non-owner read (though currently we don't have PII besides email).
12. Creating a notification for oneself with false data.

## Test Runner (Skipped for real implementation but assumed defined)
