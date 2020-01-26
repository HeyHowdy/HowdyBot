exports.run = (client, message, args) => {
    if (message.member.hasPermissions("ADMINISTRATOR")) {
        if (!args || args.length < 1) return message.reply("You must provide a command name for me to reload.");
        const command = args[0];
        const commandName = command.toLowerCase();

        if (!client.commands.has(commandName)) {
            return message.reply(`The command "**${command}**" does not exist.`);
        }
        delete require.cache[require.resolve(`./${commandName}.js`)];
        client.commands.delete(commandName);
        const props = require(`./${commandName}.js`);
        client.commands.set(commandName, props);
        message.reply(`The command ${commandName} has been reloaded`);
    } else {
        return message.reply("You do not have permissions to use this command.");
    }
};