const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Get the bot's latency in milliseconds."),

    async execute(interaction, client) {
        await interaction.deferReply();
        const ping = Date.now() - interaction.createdTimestamp;

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle("Pong!")
            .addFields(
                {
                    name: "Bot Latency:",
                    value: `${ping}ms`,
                },
                {
                    name: "Websocket Heartbeat:",
                    value: `${client.ws.shards.get(0).ping}ms`,
                }
            )
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
