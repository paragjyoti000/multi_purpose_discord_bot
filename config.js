require("dotenv").config();

module.exports = {
    token: process.env.TOKEN,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
    earlyMemberRoleId: process.env.EARLY_MEMBERS_ROLE_ID,
};
