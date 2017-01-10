exports.run = (bot, msg, args) => {
    if (args.length < 3 || msg.mentions.users.size < 1 || !args[0].startsWith('@')) {
        msg.delete();
        msg.channel.sendMessage(`:no_entry_sign: Proper usage: \`${this.info.usage}\``).then(m => m.delete(1e4));
        return;
    }
    msg.delete();
};

exports.info = {
    name: 'grade',
    usage: 'grade <@user> <id> <quiz/exercise>',
    description: 'Passes @user on the quiz or exercise for the given lesson'
};