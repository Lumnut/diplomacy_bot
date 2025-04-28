import { ChannelType, Client, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'

dotenv.config()

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
})

client.once('ready', async () => {
	console.log(`Logged in as ${client.user?.tag}`)

	// Whitelist of allowed channel names
	const allowedChannelNames = ['announcements', 'meta-gaming']

	const guilds = client.guilds.cache
	for (const guild of guilds.values()) {
		const channels = guild.channels.cache
		for (const channel of channels.values()) {
			// Skip non-text channels (like voice channels)
			if (channel.type !== ChannelType.GuildText) continue

			if (!allowedChannelNames.includes(channel.name.toLowerCase())) {
				// If the channel is not in the whitelist, delete it
				await channel.delete()
				console.log(`Deleted channel: ${channel.name}`)
			} else {
				// If the channel is in the whitelist, delete all messages in it
				if (channel.name != 'meta-gaming') {
					// Delete all messages in the allowed channels
					let messages = await channel.messages.fetch({ limit: 100 })
					let lastMessageId: string | undefined

					while (messages.size > 0) {
						console.log(`Fetched ${messages.size} messages from ${channel.name}`)

						for (const message of messages.values()) {
							try {
								await message.delete() // await to respect rate limits
							} catch (error) {
								console.error(`Failed to delete message: ${error}`)
							}
						}

						// Get the ID of the oldest message to paginate properly
						lastMessageId = messages.last()?.id

						if (!lastMessageId) {
							break // no more messages to paginate
						}
						messages = await channel.messages.fetch({ limit: 100, before: lastMessageId })
					}
				}
			}
		}
	}

	client.destroy()
})

client.login(process.env.BOT_TOKEN)
