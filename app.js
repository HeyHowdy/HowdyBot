//Dependencies
const Discord = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');
const { success, error, warning } = require("log-symbols");

//Configs
const config = require('./data/config.json');
const client = new Discord.Client();

//JSON files
let xp = require("./data/xp.json");
let currency = require('./data/currency.json');
let questions = require('./data/trivia.json');

//Command Handler
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.events = new Discord.Collection();

const modules = ['Administration', 'Moderation', 'Fun', 'Users'];

modules.forEach(c => {
    fs.readdir(`./commands/${c}`, (err, files) => {
        if (err) return console.log(err);
        files.forEach(file => {
            if (!file.endsWith(".js")) return;
            let props = require(`./commands/${c}/${file}`);
            console.log(`${success} Command Loaded ` + file)
            let commandName = file.split(".")[0];
            client.commands.set(commandName, props);
        });
    });
});

fs.readdir('./events/', (err, files) => {
    if (err) return console.log(err);
    files.forEach(file => {
        let eventFunc = require(`./events/${file}`);
        console.log(`${success} Event Loaded ` + file)
        let eventName = file.split(".")[0];
        client.on(eventName, (...args) => eventFunc.run(client, ...args));
    });
});

/**
* XP System
*/
client.on('message', message => {
    let xpAdd = Math.floor(Math.random() * 6) + 14;
    console.log(xpAdd);

    if (message.author.bot) return;

    if (!xp[message.author.id]) {
        xp[message.author.id] = {
            user: `${message.author.username}`,
            xp: 0,
            level: 1,
            milestone: 1,
        };
    }

    let nextLevel = xp[message.author.id].level * 300;
    let currentXp = xp[message.author.id].xp;
    let currentLevel = xp[message.author.id].level;
    let currentMilestone = xp[message.author.id].milestone;


    xp[message.author.id].xp = currentXp + xpAdd;

    if (nextLevel <= xp[message.author.id].xp) {
        xp[message.author.id].level = currentLevel + 1;
        xp[message.author.id].milestone = currentMilestone + 1;
        let levelUp = new Discord.RichEmbed()
            .setTitle("Level Up!")
            .setColor("RANDOM")
            .addField("New Level", currentLevel + 1)
            .setImage(message.author.avatarURL);
        if (config.level_channel_id == 0) {
            message.channel.send(levelUp).then(msg => { msg.delete(10000) });
        } else {
            var level_channel = message.client.channels.get(config.level_channel_id);
            level_channel.send(levelUp);
        }

        if (currentMilestone == 4) {
            let milestoneReward = currentLevel * 10 + Math.floor(Math.random() * 10) + 100;
            message.channel.send(`${message.author.username} just hit a milestone and was awarded with :shit: ${milestoneReward} hcoin.`);
            currency[message.author.id].hcoin = currency[message.author.id].hcoin + milestoneReward;
            xp[message.author.id].milestone = 0;
        }
    }


    fs.writeFile("./data/xp.json", JSON.stringify(xp), (err) => {
        if (err) console.log(err);
    });

    console.log(`Level is ${xp[message.author.id].level}`);
    console.log(`${message.author.id} XP: ${currentXp}`);
});

/**
* Currency Rewards
*/
client.on('message', message => {
    /**
     * Currency Rewards
     */

    if (message.author.bot) return;

    if (!currency[message.author.id]) {
        currency[message.author.id] = {
            user: `${message.author.username}`,
            hcoin: 0,
            message_loop: 0,
            total_messages: 0,
            trivia_guessed: 0,
        };
    }

    let messages = currency[message.author.id].message_loop;
    let coins = currency[message.author.id].hcoin;
    let totalMessages = currency[message.author.id].total_messages;

    const reward = 100;

    currency[message.author.id].message_loop = messages + 1;
    currency[message.author.id].total_messages = totalMessages + 1;

    if (currency[message.author.id].message_loop === reward) {
        let randomReward = Math.floor(Math.random() * 50) + 250;
        message.channel.send(`${message.author.username} has just recieved :shit: ${randomReward} hcoins for their activity.`);
        currency[message.author.id].hcoin = coins + randomReward;
        currency[message.author.id].message_loop = 0;
    }

    fs.writeFile("./data/currency.json", JSON.stringify(currency), (err) => {
        if (err) console.log(err);
    });
});

/**
 * Message Log
 * Will eventually log this to a file, just cba atm.
 */
function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
}

var startedTrivia = false;
var answered = false;
var userAnswer = "";
var answer = "";
var answer2 = "";
var currentQuestion = "";
var category = "";
var lastQuizID;

function startTrivia(message) {
    //Number of questions in total (check trivia.json for a count)
    number = 50
    var random = Math.floor(Math.random() * (number));
    if (random > number) {
        random = random - 1;
    } else if (random == 0) {
        random = random + 1;
    } else if (random == lastQuizID) {
        random = Math.floor(Math.random() * (number));
    }
    console.log(`Selected Quiz ID: ${random}`);
    currentQuestion = questions[random].question;
    console.log(`Trivia question set to ${currentQuestion}`);
    category = questions[random].category;
    console.log(`Trivia answer set to ${category}`);
    answer = questions[random].answer;
    answer2 = questions[random].answer2;
    console.log(`Trivia answer set to ${answer}`);
    startedTrivia = true;
    answered = false;
    lastQuizID = random;
}

client.on('message', message => {
    if (message.author.bot) return;
    if (message.channel.id == config.trivia_channel_id) {
        if (startedTrivia == true) {
            let guessCount = currency[message.author.id].trivia_guessed;
            userAnswer = message.content.toLowerCase();
            if (userAnswer == answer || userAnswer == answer2) {
                const triviaReward = 100 * xp[message.author.id].level / 2;
                let coins = currency[message.author.id].hcoin;
                currency[message.author.id].trivia_guessed = guessCount + 1;
                message.channel.send(`<@${message.author.id}> has guessed correctly. \nThe answer was: **${answer}**. \nReward for guessing correctly: :shit: ${triviaReward}.\n${message.author.username}'s trivia record is now: ${currency[message.author.id].trivia_guessed}.`);
                currency[message.author.id].hcoin = coins + triviaReward;
                setTriviaTimer(false);
                startedTrivia = false;
                answered == true;
            }
        } else {
            message.channel.send("There is currently no Trivia running. You missed it, a new trivia runs every hour so keep an eye out!");
        }
        message.delete(100);
    }
});

client.on('ready', () => {
    console.log(config.bot_name + " is now online! Version: " + config.version);

    /**
     * Clear trivia chat to keep the text channel clean
     */
    setInterval(() => {
        if (startedTrivia == false) {
            triviaChannel = client.channels.get(config.trivia_channel_id);
            triviaChannel.bulkDelete(100, true);
        }
    }, 1250 * 60 * 60);

    /**
     * Trivia interval to begin new trivia's
     */
    setInterval(() => {
        startTrivia();
        triviaChannel = client.channels.get(config.trivia_channel_id);
        console.log(`Channel: ${triviaChannel}`);

        let triviaBegun = new Discord.RichEmbed()
            .setTitle("TRIVIA!")
            .setColor("RANDOM")
            .addField("Category", category)
            .addField("Question", currentQuestion)
            .addField("Quickly", `You have ${config.trivia_seconds} seconds to answer correctly!`)

        triviaChannel.send(triviaBegun);
        //triviaChannel.send("@everyone");

        random = 0;
        setTriviaTimer(true);
        //}, 10000); // for testing
    }, 400 * 60 * 60); //miliseconds.

    client.user.setPresence({
        status: "online",
        game: {
            name: "Being developed",
            type: "STREAMING"
        }
    });
});

function setTriviaTimer(bool) {
    let timer = config.trivia_seconds * 1000;
    if (bool == false) {
        clearInterval(checkTriviaTime);
    } else if (bool == true) {
        var checkTriviaTime = setInterval(() => {
            startedTrivia = false;
            clearInterval(checkTriviaTime);
        }, timer);
    }
}

client.on('message', message => {
    //console.log("[" + getDateTime() + "] " + message.member.displayName + ": " + message.content);
});

//Bot login
client.login(config.token);
