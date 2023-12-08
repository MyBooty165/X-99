const Discord = require('discord.js');
const fs = require('fs');
const axios = require('axios');

const client = new Discord.Client();
const prefix = '/';

const supportChannelIds = ['YourSupportChannelId1'];
const adminRoleId = 'YourAdminRoleId';
const projectFilePath = './json/project.json';
const spoilerFilePath = './json/spoiler.json';
const openaiReverseProxyEndpoint = 'YourOpenAIReverseProxyEndpoint';

client.on('message', async (message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'support') {
        if (message.channel.type !== 'dm') {
            return message.reply('Please use the support command in DMs.');
        }

        const supportMessage = args.join(' ');
        const supportEmbed = new Discord.MessageEmbed()
            .setTitle('Support Message')
            .setDescription(`User ID: ${message.author.id}\n\n${supportMessage}`);

        supportChannelIds.forEach((channelId) => {
            const supportChannel = client.channels.cache.get(channelId);
            if (supportChannel && supportChannel.type === 'dm') {
                supportChannel.send(supportEmbed);
            }
        });

        message.author.send('Your support message has been sent successfully.');
    } else if (command === 'ban' && message.member.roles.cache.has(adminRoleId)) {
        const banTarget = message.mentions.users.first() || client.users.cache.get(args[0]);
        if (!banTarget) return message.reply('Please mention a user or provide their ID.');

        const bannedUsers = JSON.parse(fs.readFileSync('./json/bannedUsers.json', 'utf8'));

        if (!bannedUsers.includes(banTarget.id)) {
            bannedUsers.push(banTarget.id);
            fs.writeFileSync('./json/bannedUsers.json', JSON.stringify(bannedUsers, null, 2));
            message.reply(`User ${banTarget.tag} has been banned from using support.`);
        } else {
            message.reply('This user is already banned.');
        }
    } else if (command === 'projects') {
        const projectData = fs.readFileSync(projectFilePath, 'utf8');
        const projects = JSON.parse(projectData);

        message.channel.send('Projects: \n' + JSON.stringify(projects, null, 2));
    } else if (command === 'spoiler') {
        const spoilerData = fs.readFileSync(spoilerFilePath, 'utf8');
        const spoilers = JSON.parse(spoilerData);

        message.channel.send('Spoilers: \n' + JSON.stringify(spoilers, null, 2));
    } else if (command === 'gpt') {
        const gptPrompt = args.join(' ');

        try {
            const gptResponse = await generateGPTResponse(openaiReverseProxyEndpoint, gptPrompt);
            message.channel.send(`${gptResponse}`);
        } catch (error) {
            console.error('Error generating ChatGPT response:', error.message);
            message.channel.send('Error generating ChatGPT response.');
        }
    }
});

async function generateGPTResponse(reverseProxyEndpoint, prompt) {
    const response = await axios.post(reverseProxyEndpoint, {
        model: 'gpt-3.5-turbo',
        messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: prompt },
        ],
    });

    return response.data.choices[0].message.content;
}

client.login('MTE0MDgxNzAwMDI3MzI5NzUwOQ.GXE0gT.3sCG9VzeDroSCqAg5TZGeJnHDPPTPq_lZoI8vs');