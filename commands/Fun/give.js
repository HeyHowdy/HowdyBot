const { Discord, RichEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
let currency = require("../../data/currency.json");
const { getMember } = require("../../functions.js");
const fs = require('fs');
let hcoin = require("../../data/currency.json");

module.exports = {
    name: "give-hcoin",
    description: "Give a user hcoin",
    usage: "[mention | amount]",

    run: async (client, message, args) => {
        const member = getMember(message, args.join(" "));
        let amount = parseInt(args[1]);
        let give_wallet = hcoin[message.author.id].hcoin;
        let receive_wallet = hcoin[member.id].hcoin;

        if (amount == 0) return message.channel.send("Why you tranna give nothing?");
        if (amount > give_wallet) return message.channel.send("You do not have that much hcoin to give.");

        if (!hcoin[member.id]) {
            return message.channel.send(`I cannot ${member.displayName} any hcoin as they don't have any data stored.`)
        }

        hcoin[message.author.id].hcoin = hcoin[message.author.id].hcoin - amount;
        hcoin[member.id].hcoin = hcoin[member.id].hcoin + amount;

        const embed = new RichEmbed()
            .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)
            .addField('Transaction', stripIndents`**> Amount Given: ** :shit: ${amount}
            **> ${message.author.username}'s New Balance:** :shit: ${hcoin[message.author.id].hcoin}
            **> ${member.displayName}'s New Balance:** :shit: ${hcoin[member.id].hcoin}`, true)


        message.channel.send(embed);

        return;


    }
}