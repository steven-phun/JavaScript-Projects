const SlackBot = require('slackbots');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const bot = new SlackBot ({
    token: 'xoxb-1243057381542-1250033781923-cbSP0vRzIp9oP6fnRaUmD01k',
    name: 'churchbot'
});

// start handler
bot.on('start', )