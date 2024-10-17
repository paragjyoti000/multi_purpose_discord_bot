const {
    EmbedBuilder,
    SlashCommandBuilder,
    PermissionFlagsBits,
} = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Select a member and unban them.")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("The member to unban")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),

    async execute(interaction, client) {
        const target = interaction.options.getUser("target");

        const embed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle("Unbanned")
            .setAuthor({
                name: target.globalName,
                iconURL: target.displayAvatarURL({
                    dynamic: true,
                }),
            })
            .setDescription(`*${target}* has been Unbanned from the server.`)
            .setTimestamp();

        await interaction.guild.members.unban(target);
        await interaction.reply({
            embeds: [embed],
        });
    },
};
