const { RichEmbed } = require('discord.js');
const randomPuppy = require('random-puppy');

module.exports = {
    name: "meme",
    category: "fun",
    description: "Send a random meme",

    run: async (client, message, args) => {
        const subReddits = ["dankmeme", "meme", "me_irl", "bikinibottomtwitter", "memeeconomy", "trippinthroughtime", "WhitePeopleTwitter", "bonehurtingjuice"];
        const random = subReddits[Math.floor(Math.random() * subReddits.length)];
        const img = await randomPuppy(random);
        const embed = new RichEmbed()
            .setColor("RANDOM")
            .setImage(img)
            .setTitle(`From /r/${random}`)
            .setURL(`http://reddit.com/r/${random}`)

        message.channel.send(embed);
    }
}