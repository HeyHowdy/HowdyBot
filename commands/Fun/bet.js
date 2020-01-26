const Discord = require('discord.js');
const config = require('../../data/config.json');
let hcoin = require('../../data/currency.json');

module.exports = {
    name: "bet",
    description: "bet your hcoin",
    usage: "[beton | amount | number]",

    run: async (client, message, args) => {
        //const arg = message.content.slice(prefix.length).split(" ");
        let betAmount = parseInt(args[0]);
        let betNumber = parseInt(args[1]);
        let random = Math.floor(Math.random() * 15);
        let userhcoin = hcoin[message.author.id].hcoin;

        if (random == 0) {
            random = Math.floor(Math.random() * 15);
        }

        if (betAmount == 0) return message.channel.send(`<@${message.author.id}> You must select an amount of :shit: hcoin to bet.`);
        if (betNumber < 1 || betNumber > 15) return message.channel.send(`<@${message.author.id}> You can only bet on the numbers between 1-15.`);
        if (betAmount > userhcoin) return message.channel.send(`<@${message.author.id}> You do not have enough hcoin for this bet. You currently have: :shit:${userhcoin}`);

        message.channel.send("Bet has been taken");

        if (betNumber == random) {
            message.channel.send(`Number selected was **${random}**. <@${message.author.id}> wins :shit:${betAmount} hcoin!`);
            hcoin[message.author.id].hcoin = userhcoin + betAmount;
        } else {
            message.channel.send(`Number selected was **${random}**. <@${message.author.id}> loses :shit:${betAmount} hcoin!.`);
            hcoin[message.author.id].hcoin = userhcoin - betAmount
        }


    }


}