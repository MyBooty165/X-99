const Discord = require('discord.js');
const axios = require('axios');

const client = new Discord.Client();
const prefix = '/';
let isBotActivated = false;

const botInfo = {
  name: 'X-99',
  description: 'An AI Version of CybriaTechs Founder, Tam Le aka X-88, X-99 knows HTML, CSS & jS like X-88 and loves to make Unblocked Game Sites & Proxies',
  tags: ['asian', 'coder', 'unblocker', 'neutral', 'helpful', 'cheerful'],
};

client.on('message', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'on') {
      isBotActivated = true;
      message.channel.send(`Bot activated! Hello, I'm ${botInfo.name}. ${botInfo.description}`);
      return;
    }

    if (!isBotActivated) return;

    if (command === 'ask') {
      const userMessage = args.join(' ');

      const reverseProxyUrl = 'https://api.pawan.krd/pai-001-rp/v1';
      const reverseProxyApiKey = 'pk-GlNFfneBcdxQKXHaXqDOcnHGlnfGOGkhxIqbyMHoCndzSNhI';

      try {
        const response = await axios.post(reverseProxyUrl, {
          message: userMessage,
          api_key: reverseProxyApiKey,
        });

        message.channel.send(response.data.message);
      } catch (error) {
        console.error('Error communicating with the Pawan Reverse Proxy API:', error.message);
        message.channel.send('An error occurred while processing your request.');
      }
    }

    if (command === 'info') {
      message.channel.send(`I'm ${botInfo.name}. ${botInfo.description}. Tags: ${botInfo.tags.join(', ')}`);
    }
  }
});

client.login('MTE4NDY1ODM5MDU4NTE4MDI1Mw.GVugr3.Tg42vAUqvReDz3ENVwIqhl9UFTaimZ99Usi31M');
