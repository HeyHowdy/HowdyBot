module.exports = {
    name: "clear",
    aliases: "purge",
    category: "moderation",
    description: "Clear the chat",
    run: async (client, message, args) => {
        if (message.deletable) {
            message.delete();
        }

        //Member doesn't have permissions
        if (!message.member.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("You do not have permission to clear messages").then(m => m.delete(5000));
        }

        //checks if message is not a number
        if (isNaN(args[0]) || parseInt(args[0]) <= 0) {
            return message.reply("You must reply with a number of messages you wish to delete").then(m => m.delete(5000));
        }

        //If the bot cannot delete messages
        if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
            return message.reply("I have not been granted permissions to remove messages");
        }

        let deleteAmount;

        if (parseInt(args[0]) > 100) {
            deleteAmount = 100;
        } else {
            deleteAmount = parseInt(args[0]);
        }

        message.channel.bulkDelete(deleteAmount, true)
            .then(deleted => message.channel.send(`:notepad_spiral: I have successfully removed ${deleted.size} messages`).then(m => m.delete(10000)))
            .catch(err => message.reply(`Something went wrong... ${err}`));
    }
}