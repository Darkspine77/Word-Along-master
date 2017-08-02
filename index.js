var Discord = require('discord.js');

var bot = new Discord.Client();

var token = 'MzQwNjM2ODQ2ODg5NjMxNzQ1.DF1jJA.EPiFPAFGxqZh-DoVLuopNlaVUxA';

var inv = "https://discordapp.com/oauth2/authorize?client_id=340636846889631745&scope=bot&permissions=268436496"

bot.login(token);

bot.on('guildCreate', guild => {
	console.log("Joined " + guild.name)
	finalMessage = "```"
	finalMessage += "Thank your for adding Word Along to your server! \n"
	finalMessage += "This bot is made to create private text channels for users in voice channels\n"
	finalMessage += "Type v!help to view all of the commands \n"
	finalMessage += "```"
	guild.defaultChannel.sendMessage(finalMessage)
});

bot.on('voiceStateUpdate', (oldMember,newMember) => {
	if(oldMember.voiceChannelID != null){
		var vc = oldMember.guild.channels.get(oldMember.voiceChannelID)
		if(vc.guild.roles.findAll("name",(vc.name + "-vc").toLowerCase())[0] != undefined){
			newMember.removeRole(vc.guild.roles.findAll("name",(vc.name + "-vc").toLowerCase())[0])
		}
		if(vc.members.array().length == 0){
			if(vc.guild.roles.findAll("name",(vc.name + "-vc").toLowerCase())[0] != undefined && vc.guild.channels.findAll("name",(vc.name + "-vc").toLowerCase())[0] != undefined){
				vc.guild.channels.findAll("name",(vc.name + "-vc").toLowerCase())[0].delete()
				vc.guild.roles.findAll("name",(vc.name + "-vc").toLowerCase())[0].delete()
			}
		}
	}
	if(newMember.voiceChannelID != oldMember.voiceChannelID){
		if(newMember.voiceChannelID != null){
			var vc = newMember.guild.channels.get(newMember.voiceChannelID)
			if(vc.members.array().length == 1){
				vc.guild.createRole({
					name:(vc.name + "-vc").toLowerCase(),
					color:"#FFE4AF",
					mentionable: true
				}).then(role => {
					newMember.addRole(role)
					vc.guild.createChannel((vc.name + "-vc").toLowerCase()).then(channel => {
						channel.overwritePermissions(role.id, {
							READ_MESSAGES: true
						})
						channel.overwritePermissions('340636846889631745', {
							READ_MESSAGES: true
						})
						channel.overwritePermissions(vc.guild.id, {
							READ_MESSAGES: false
						})
					})	
				})
			} else {
				if(vc.guild.roles.findAll("name",(vc.name + "-vc").toLowerCase())[0] != undefined){
					newMember.addRole(vc.guild.roles.findAll("name",(vc.name + "-vc").toLowerCase())[0])
				}
			}
		}
	}
})

bot.on('message', message => {
	var input = message.content.toLowerCase().split(" ")
	if(input[0] == "v!help" && input.length == 1){
		finalMessage = "```"
		finalMessage += "To get an invite link for this bot -> v!invite \n"
		finalMessage += "To report an error -> v!report (text here) \n"
		finalMessage += "```"
		message.channel.sendMessage(finalMessage)
	}
	if(input[0] == "v!invite"){
		message.channel.sendMessage("My invite link!: <" + inv + ">")
	}
	if(input[0] == "v!report"){
		if(input.length >= 2){
			var finalMessage = message.author.username + ": " + message.content.split("v!report")[1]
			var	messageReply = "```"
			messageReply += "Thank you for reporting a problem you found, The Word Along team apologizes for any inconvenience you have experienced! \n"
			messageReply += "```"
			message.channel.sendMessage(messageReply)
			bot.fetchUser('163809334852190208').then(user => 
				user.createDM().then(dm => {
						dm.sendMessage(finalMessage)
					}
				)
			)
		}
	}
})