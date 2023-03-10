const mongoose = require('mongoose');

module.exports = mongoose.model("GuildConfig", new mongoose.Schema({
    guildID: String,
    guildName: String,

    config: {
        chatChannel: {type: String, default: null},
    }
}))