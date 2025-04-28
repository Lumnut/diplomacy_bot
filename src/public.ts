import { ChannelType, Client, GatewayIntentBits, PermissionsBitField, TextChannel } from 'discord.js'
import * as dotenv from 'dotenv'

dotenv.config()

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
})

client.once('ready', async () => {
	console.log(`Logged in as ${client.user?.tag}`)

	const guilds = client.guilds.cache
	for (const guild of guilds.values()) {
		const channels = guild.channels.cache
		for (const channel of channels.values()) {
			// Skip non-text channels (like voice channels)
			if (channel.type !== ChannelType.GuildText) continue

			try {
				await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
					ViewChannel: true,
				})
				console.log(`Made public: ${channel.name}`)
			} catch (error) {
				console.error(`Failed to set ${channel.name} to public:`, error)
			}
		}
	}

	await client.destroy()
})

client.login(process.env.DISCORD_TOKEN)
