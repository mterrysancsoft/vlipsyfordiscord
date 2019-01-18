require('dotenv').config()
const axios = require('axios')
const Discord = require('discord.js')
const client = new Discord.Client()
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const VLIPSY_API_KEY = process.env.VLIPSY_API_KEY
const VLIPSY_BASE_URL = 'https://vlipsy.com/vlip/'
const VLIPSY_LIMIT = 10
const DISCORD_MESSAGE_MAX_LENGTH = 2000

client.on('ready', () => { 
    console.log(`Logged in as ${client.user.tag}!`);
 });

client.on('message', async (msg) =>  {
    try 
    {
        console.log('Message: ' + msg);
        if (msg.content.startsWith('!vliplist')) {
            var search = msg.content.replace('!vlipinfo','').trim();
            const vlips = await getVlips(search);
            var index = 0;
            var catalog = "";
            vlips.forEach(function(vlip) {
                catalog += `${++index}: ${vlip.title} from ${vlip.from} - (${vlip.rating}) /${vlip.slug}\r`;
            })
            msg.channel.send(catalog.substr(0,DISCORD_MESSAGE_MAX_LENGTH))
        }
        else if (msg.content.startsWith('!vlip')) {
            var search = msg.content.replace('!vlip','').trim();
            const vlip = await getFirstVlip(search);
            if (vlip) {
                msg.channel.send(`${vlip.title} from ${vlip.from} - ${vlip.media.mp4.url}`);
            }
        }
    }
    catch (error)
    {
        msg.channel.send(`Sorry, I got nothing... `);
        console.log(error);
    }
});

const getFirstVlip = async (search) => {
    const vlips = await getVlips(search);
    if ((vlips) && (vlips.length > 0)) {
        return vlips[0];
    }
    throw new Error('No vlip returned');
}

const getVlips = async (search) => {
    let response = await axios.get(`https://apiv2.vlipsy.com/v1/vlips/search?key=${VLIPSY_API_KEY}&q=${search}&limit=${VLIPSY_LIMIT}`);
    if (response.status == 200) {
        if (response.data.data.length > 0) {
            return response.data.data;
        }
    }
    throw new Error('No vlips returned');
}

client.login(DISCORD_BOT_TOKEN);

