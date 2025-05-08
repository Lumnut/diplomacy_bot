# diplomacy_bot

A simple discord bot to aid communication for the game Diplomacy.

It is designed to be run manually at game end in 1 of 3 modes:

### public mode:

Usage: npm run public

Makes every private channel public

### delete mode:

Usage: npm run delete

Deletes every channel not in the whitelist ('announcements', 'meta-gaming') and deletes every message in the announcements channel

### rename mode:

Usage: npm run rename

Requires you to first

-   update the readme.ts file players array with the appropriate member names, new nickname and role.
-   Have all the roles already exist in Discord

Updates the nicknames to the set values, removes all other roles and sets the role to the set value.
