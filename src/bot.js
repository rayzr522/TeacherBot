const Discord = require('discord.js');
const LessonManager = require('./lessons');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const fse = require('fs-extra');
const read = require('fs-readdir-recursive');
const {log} = require('./debug');

const bot = new Discord.Client();
const commands = bot.commands = {};
const lessons = bot.lessons = new LessonManager();

let invite_template = 'https://discordapp.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&scope=bot&permissions=469822582';

try {
    if (!fs.existsSync(path.resolve(__dirname, 'config.json'))) {
        fse.copySync(path.resolve(__dirname, 'config.json.example'), path.resolve(__dirname, 'config.json'));
        log('Copied default config.json file. After you fill it out, please restart the bot.');
        process.exit(1);
    }
} catch (e) {
    console.error('Failed to check validity of the config.json file:\n' + e);
    process.exit(1);
}

const config = bot.config = require('./config.json');

if (!config.token || !/^[A-Za-z0-9\.]+$/.test(config.token)) {
    console.error('Config is missing a valid bot token! Please acquire one at https://discordapp.com/developers/applications/me');
    process.exit(1);
}

function validateCommand(command) {
    if (typeof command !== 'object') return 'Exports are empty';
    if (typeof command.run !== 'function') return 'Missing run function';
    if (typeof command.info !== 'object') return 'Missing info object';
    if (typeof command.info.name !== 'string') return 'Info object missing "name"';
    if (typeof command.info.usage !== 'string') return 'Info object missing "usage"';
    if (typeof command.info.description !== 'string') return 'Info object missing "description"';
    return '';
}

function loadCommands() {
    read(path.resolve(__dirname, 'commands'), file => !file.startsWith('_') && file.endsWith('.js')).forEach(file => {
        // if (file.startsWith('_') || !file.endsWith('.js')) return;
        var command = require(path.resolve(__dirname, 'commands', file));
        var check = validateCommand(command);
        if (check) {
            log(`Error in "${file}": ${chalk.red(check)}`);
            return;
        }
        if (commands[command.info.name]) {
            log(`Duplicate command: An entry already exists for command ${chalk.red(command.info.name)} in file "${file}"`);
        }
        commands[command.info.name] = command;
    });
}



function time(callback) {
    let start = process.hrtime();
    callback();
    let diff = process.hrtime(start);
    return (diff[0] + diff[1] / 1e6).toFixed(2);
}

bot.on('ready', () => {
    log('Loading commands...');
    var loadTime = time(loadCommands);
    log(`Commands loaded in ${loadTime}ms.`);

    log('Loading lessons...');
    loadTime = time(() => lessons.loadLessons(path.resolve(__dirname, '../lessons/')));
    log(`Lessons loaded in ${loadTime}ms.`);

    log('Lessons:\n' + lessons.getLessons().map(l => '- ' + l.name).join('\n'));

    bot.user.setAvatar(path.resolve(__dirname, '../avatar.png'));

    log('Bot has loaded successfully. We\'re in business!');

    log('Use the following link to invite TeacherBot to your server:\n' + chalk.blue(invite_template.replace('YOUR_CLIENT_ID', bot.user.id)));
});

bot.on('message', (msg) => {
    if (msg.author.id === bot.user.id) return;
    if (!msg.content.startsWith(config.prefix)) return;
    let content = msg.content.substr(config.prefix.length);
    let command = content.split(' ')[0];
    let args = content.split(' ').splice(1);
    if (commands[command]) {
        try {
            msg.editEmbed = (embed) => {
                msg.edit('', { embed });
            };
            commands[command].run(bot, msg, args);
        } catch (e) {
            msg.edit('Failed to run command:\n```' + e + '```').then(m => m.delete(5000));
        }
    }
});

bot.login(config.token);