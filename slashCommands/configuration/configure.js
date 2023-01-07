const {ApplicationCommandType, EmbedBuilder} = require("discord.js");
const Schema = require("../../Database/guildConfigSchema");
module.exports = {
    name: 'configure',
    description: "Configure any of the available settings",
    cooldown: 3000,
    type: ApplicationCommandType.ChatInput,
    category: "configuration",
    options: [
        {
            name: "set",
            description: "Change a setting",
            type: 1,
            options: [
                {
                    name: "chat-channel",
                    description: "Set the channel where the bot will send messages",
                    type: 7,
                }
            ]
        },
        {
            name: "reset",
            description: "Reset/delete a setting to the default value",
            type: 1,
            options: [
                {
                    name: "chat-channel",
                    description: "Reset the channel where the bot will send messages",
                    type: 3,
                    choices: [
                        {
                            name: "Reset/Delete",
                            value: "chat-reset"
                        }
                    ]
                }
                ]
        },
        {
            name: "view",
            description: "View the current value of a setting",
            type: 1,
        }
    ],
    run: async (client, interaction) => {

        switch(interaction.options.getSubcommand()) {
            case "set":
                const channel = interaction.options.getChannel("chat-channel");
                if (!channel) return interaction.reply({
                    content: "Please provide a channel to set as the chat channel",
                    ephemeral: true
                });

                await Schema.findOne({guildID: interaction.guild.id}).then(async (data) => {
                    if (!data) {
                        await new Schema({
                            guildID: interaction.guild.id,
                            guildName: interaction.guild.name,
                            config: {
                                chatChannel: channel.id
                            }
                        }).save()
                        return interaction.reply({content: `Chat channel set to <#${channel.id}>, you can start talking to openAI there!`})
                    } else {
                        data.config.chatChannel = channel.id;
                        await data.save();
                        return interaction.reply({content: `Chat channel set to <#${channel.id}>, you can start talking to openAI there!`})
                    }
                })
                break;
            case "reset":
                const choice = interaction.options.getString("chat-channel");

                if (choice === "chat-reset") {
                    await Schema.findOne({guildID: interaction.guild.id}).then(async (data) => {
                        data.config.chatChannel = null;
                        await data.save();
                        return interaction.reply({content: "Chat channel has been reset to the default value!"})
                    })

                }
                break;

                case "view":
                    await Schema.findOne({guildID: interaction.guild.id}).then(async (data) => {
                        return interaction.reply({
                            embeds: [
                                new EmbedBuilder()
                                    .setColor("Random")
                                    .setTitle(`Current settings for ${interaction.guild.name}`)
                                    .setDescription(`\`\`\`diff\n${data.config.chatChannel ? `+ Chat Channel: set to ${data.config.chatChannel}` : `- Chat Channel: Not Set`}\`\`\``)
                            ]
                        })
                    })
                break;

            default:
                return interaction.reply({content: "Please use one of the options!", ephemeral: true})
        }


    }
    }