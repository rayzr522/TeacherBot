exports.run = (bot, msg) => {
    msg.channel.sendMessage(':stopwatch: Ping!').then(m => {
        m.edit(`:stopwatch: Pong! \`${m.createdTimestamp - msg.createdTimestamp}ms\``);
    });
};

exports.info = {
    name: 'ping',
    usage: 'ping',
    description: 'Pings the bot'
};