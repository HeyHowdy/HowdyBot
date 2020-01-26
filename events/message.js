const config = require('../data/config.json');

exports.run = async (client, message) => {
    const config = require('../data/config.json');
    if (message.author.bot) return;
    if (message.content.startsWith(config.prefix)) {
        if (message.channel.id == config.commands_channel_id || message.member.hasPermission("MANAGE_MESSAGES")) {
            let messageArray = message.content.split(" ");
            let cmd = messageArray[0];
            let args = messageArray.slice(1);
            let commandfile = client.commands.get(cmd.slice(config.prefix.length));
            if (!commandfile) return;
            commandfile.run(client, message, args);
        } else if (config.commands_channel_id == 0) {
            message.reply("I cannot yet take command requests, the owner of the server has not set up a commands channel.").then(msg => {
                msg.delete(15000);
            });
        } else {
            message.reply("You cannot request commands in this text channel.").then(msg => {
                msg.delete(10000);
            });
        }
    }
    var lowercaseMessage = message.content.toLowerCase();
    if (lowercaseMessage.includes("hey!")) {
        message.reply("Hey there!");
    }
};