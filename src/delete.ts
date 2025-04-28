import { ChannelType, Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // To read message content
    ],
});

client.once("ready", async () => {
    console.log(`Logged in as ${client.user?.tag}`);

    // Names of the channels you want to allow messages in (case-insensitive)
    const allowedChannelNames = ["announcements", "meta-gaming"]; // Channel names here

    // Get all the channels in the guild
    const guild = client.guilds.cache.first(); // Assumes the bot is in only one server, modify if needed
    if (!guild) {
        console.log("No guilds found!");
        return;
    }

    try {
        // Iterate through all channels in the guild
        const channels = await guild.channels.fetch();
        for (const channel of channels.values()) {
            if (!channel) continue; // Skip if channel is null or undefined

            // Skip non-text channels (like voice channels)
            if (channel.type !== ChannelType.GuildText) continue;

            // Only process channels that are NOT in the allowed list
            if (!allowedChannelNames.includes(channel.name.toLowerCase())) {
                let lastMessageId: string | null = null;

                // Paginate through messages
                do {
                    // Fetch the latest 100 messages, using the lastMessageId to paginate
                    const messages = await channel.messages.fetch({
                        limit: 100,
                        before: lastMessageId, // Paginate by fetching older messages
                    });

                    // Check if we fetched any messages
                    if (messages.size === 0) break;

                    // Loop through each message and delete it
                    for (const message of messages.values()) {
                        try {
                            // Delete the message
                            await message.delete();
                            console.log(
                                `Deleted message from ${message.author.tag} in channel ${channel.name}`
                            );
                        } catch (error) {
                            console.error("Error deleting message:", error);
                        }
                    }

                    // Update lastMessageId to paginate further
                    lastMessageId = messages.last()?.id ?? null;
                } while (lastMessageId); // Continue fetching older messages until none are left
            }
        }
    } catch (error) {
        console.error("Error fetching channels or messages:", error);
    }

    // Exit after the task is complete
    client.destroy();
});

client.login(process.env.BOT_TOKEN);
