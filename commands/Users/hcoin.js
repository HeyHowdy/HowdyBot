const Discord = require('discord.js');
let currency = require("../../data/currency.json");

module.exports = {
    name: "hcoin",
    category: "economy",
    description: "check a users hcoin wallet",

    run: async (client, message, args) => {
        let coins = currency[message.author.id].hcoin;

        if (!currency[message.author.id]) {
            message.channel.reply("Sorry! I could not find any data on you.");
        }

        let embed = new Discord.RichEmbed()
            .setTitle(`${message.author.username}'s hcoin Wallet`)
            .setColor("RANDOM")
            .addField("hcoin ", `:shit: ${coins}`)
            .addField("Total Server Messages", currency[message.author.id].total_messages)
        message.channel.send(embed);
    }
}