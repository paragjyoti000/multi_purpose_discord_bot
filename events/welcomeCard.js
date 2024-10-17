const { Events, AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const JSONdata = require("../data.json");
const { earlyMemberRoleId, welcomeCardUrl, logoUrl } = require("../config.js");

const fs = require("fs");
const config = require("../config.js");

// Function to generate custom welcome card
async function generateWelcomeCard(member) {
    // Create a canvas object
    const canvas = createCanvas(800, 450);
    const ctx = canvas.getContext("2d");

    try {
        // Load background image
        const background = await loadImage(welcomeCardUrl);
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        // Draw user's avatar in the middle
        const avatar = await loadImage(
            member.user.displayAvatarURL({
                extension: "png",
                forceStatic: true,
                size: 256,
            })
        );

        const logo = await loadImage(logoUrl);

        // Define text and image sizes
        const avatarSize = 80;
        const nameSize = 30;
        const usernameSize = 21;
        const logoSize = 200;
        const welcomeSize = 80;
        // End of text and image sizes

        // Define avatar position
        const avatarX = canvas.width / 10 - avatarSize / 2;
        const avatarY = canvas.height / 3.5 - avatarSize / 2;

        // Define logo position
        // const logoX = canvas.width / 2 - logoSize / 2;
        const logoX = canvas.width - logoSize - 30;
        const logoY = canvas.height - logoSize / 2 - 80;

        // Add message below the avatar
        ctx.fillStyle = "#64B5F6";
        ctx.font = `bold ${nameSize}px Arial`;
        ctx.textAlign = "left";
        ctx.fillText(
            member.user.globalName,
            avatarX + avatarSize + 15,
            avatarY - 12
        );

        ctx.fillStyle = "#FFCDD2";
        ctx.font = `${usernameSize}px Arial`;
        ctx.textAlign = "left";
        ctx.fillText(
            `@${member.user.username}`,
            avatarX + avatarSize + 15,
            avatarY + 12
        );

        ctx.drawImage(logo, logoX, logoY - 50, logoSize, logoSize);

        ctx.strokeStyle = "#FFEB3B"; // yellow color
        ctx.font = `Bold ${welcomeSize}px Arial`;
        ctx.textAlign = "right";
        ctx.lineWidth = 2;
        ctx.strokeText(
            "WELCOME",
            logoX + logoSize - 10,
            logoY + logoSize / 2 + 40
        );

        ctx.beginPath();
        ctx.arc(
            avatarX + avatarSize / 2,
            avatarY + avatarSize / 2 - 50,
            avatarSize / 2 + 5 / 2,
            0,
            Math.PI * 2
        );
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#64B5F6";
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
            avatarX + avatarSize / 2,
            avatarY + avatarSize / 2 - 50,
            avatarSize / 2,
            0,
            Math.PI * 2
        );

        ctx.closePath();

        ctx.clip();

        ctx.drawImage(avatar, avatarX, avatarY - 50, avatarSize, avatarSize);

        const buffer = canvas.toBuffer("image/png");

        // Create a message attachment
        const attachment = new AttachmentBuilder(buffer, {
            name: "welcome.png",
        });

        return attachment;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const channel = member.guild.channels.cache.get(
            member.guild.systemChannelId
        );

        if (!channel) return;

        const attachment = await generateWelcomeCard(member);

        channel.send({
            content: `Welcome to the server, ${member}! We're glad to have you here.`,
            files: [attachment],
        });

        const { earlyMembers } = JSONdata;

        if (
            (earlyMembers.remaining > 0 ||
                earlyMembers.members.includes(member.id)) &&
            earlyMemberRoleId
        ) {
            if (!earlyMembers.members.includes(member.id)) {
                earlyMembers.members.push(member.id);
                earlyMembers.remaining--;
                fs.writeFile(
                    "data.json",
                    JSON.stringify({ ...JSONdata, earlyMembers }),
                    (err) => {
                        if (err) throw err;
                    }
                );
            }

            member.roles.add(earlyMemberRoleId);
        }
    },
};
