import { ChannelType, Client, GatewayIntentBits, Partials, PermissionsBitField, TextChannel } from 'discord.js'
import * as dotenv from 'dotenv'

dotenv.config()

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
	partials: [Partials.GuildMember],
})

type country = 'Italy' | 'Turkey' | 'Austria-Hungary' | 'Russia' | 'Germany' | 'France' | 'England'

const players: Player[] = [
	{
		name: 'lumnut', // Lum
		nickname: 'Austria-Hungary (Lum)',
		role: 'Austria-Hungary',
	},
	{
		name: '_peepee_', // Patrick
		nickname: 'Germany (Patrick)',
		role: 'Germany',
	},
	{
		name: 'emeras', // Kenan
		nickname: 'France (Kenan)',
		role: 'France',
	},
	{
		name: 'capn365', // Jordan
		nickname: 'Russia (Jordan)',
		role: 'Russia',
	},
	{
		name: 'abacussonkus', // Jackson
		nickname: 'England (Jackson)',
		role: 'England',
	},
	{
		name: 'yoshi6245', // Yosuke
		nickname: 'Turkey (Yosuke)',
		role: 'Turkey',
	},
]

interface Player {
	name: string
	nickname: string
	role: country
}

client.once('ready', async () => {
	console.log(`Logged in as ${client.user?.tag}`)

	const guilds = client.guilds.cache
	for (const guild of guilds.values()) {
		const members = await guild.members.fetch()

		for (const member of members) {
			const player = players.find((m) => m.name === member[1].user.username)
			if (!player) {
				console.log(`Player not found: ${member[1].user.username}`)
				continue
			}

			const role = guild.roles.cache.find((r) => r.name === player.role)
			if (!role) {
				console.log(`Role not found: ${player.role}`)
				continue
			}

			await member[1].setNickname(player.nickname)
			await member[1].roles.add(role)
			console.log(`Member Set: ${member[1].user.username}`)
		}
	}

	await client.destroy()
})

client.login(process.env.DISCORD_TOKEN)
