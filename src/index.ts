// src/index.ts
import {
    Client,
    GatewayIntentBits,
    PermissionsBitField,
    TextChannel,
} from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.once("ready", async () => {
    console.log(`Logged in as ${client.user?.tag}`);

    if (!client.user) return;

    for (const [guildId, guild] of client.guilds.cache) {
        const fullGuild = await guild.fetch();
        const everyoneRole = fullGuild.roles.everyone;
        const changedChannels: string[] = [];

        for (const channel of fullGuild.channels.cache.values()) {
            if (channel instanceof TextChannel) {
                const overwrites = channel.permissionOverwrites.resolve(
                    everyoneRole.id
                );

                if (
                    overwrites?.deny.has(PermissionsBitField.Flags.ViewChannel)
                ) {
                    try {
                        await channel.permissionOverwrites.edit(everyoneRole, {
                            ViewChannel: true,
                        });
                        changedChannels.push(channel.name);
                    } catch (error) {
                        console.error(
                            `Failed to update permissions for ${channel.name}:`,
                            error
                        );
                    }
                }
            }
        }

        console.log(`Guild: ${fullGuild.name}`);
        if (changedChannels.length > 0) {
            console.log(`Made public: ${changedChannels.join(", ")}`);
        } else {
            console.log("No private text channels found.");
        }
    }

    // Optional: logout the bot automatically after done
    console.log("Finished making all private channels public. Logging out...");
    await client.destroy();
});

client.login(process.env.DISCORD_TOKEN);
