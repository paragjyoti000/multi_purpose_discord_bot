const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    SlashCommandBuilder,
    PermissionFlagsBits,
} = require("discord.js");

module.exports = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Select a member and ban them.")
        .addUserOption((option) =>
            option
                .setName("target")
                .setDescription("The member to ban")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option.setName("reason").setDescription("The reason for banning")
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .setDMPermission(false),

    async execute(interaction, client) {
        const target = interaction.options.getUser("target");
        const reason =
            interaction.options.getString("reason") ?? "No reason provided";

        const confirm = new ButtonBuilder()
            .setCustomId("confirm")
            .setLabel("Confirm Ban")
            .setStyle(ButtonStyle.Danger);

        const cancel = new ButtonBuilder()
            .setCustomId("cancel")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder().addComponents(cancel, confirm);

        const response = await interaction.reply({
            content: `Are you sure you want to ban ${target} for reason: \`${reason}\`?`,
            components: [row],
        });

        const collectorFilter = (i) => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({
                filter: collectorFilter,
                time: 60_000,
            });

            const embed = new EmbedBuilder()
                .setColor(0x00ff00)
                .setTitle("Banned")
                .setAuthor({
                    name: target.globalName,
                    iconURL: target.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(
                    `*${target}* has been banned from the server.\n**Reason**: \`${reason}\``
                )
                .setTimestamp();

            if (confirmation.customId === "confirm") {
                await interaction.guild.members.ban(target);
                await confirmation.update({
                    content: "Action completed",
                    embeds: [embed],
                    components: [],
                });
            } else if (confirmation.customId === "cancel") {
                await confirmation.update({
                    content: "Action cancelled",
                    components: [],
                });
            }
        } catch (e) {
            await interaction.editReply({
                content:
                    "Confirmation not received within 1 minute, cancelling",
                components: [],
            });
        }
    },
};
