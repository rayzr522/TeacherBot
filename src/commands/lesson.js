const utils = require('../utils');

exports.run = (bot, msg, args) => {
    utils.multiSend(msg.channel, [
        'Hello!',
        'I am the new bot, TeacherBot!',
        'How are you today?',
        'This is quite a lovely day, isn\'t it?',
        'Well, goodbye now!'
    ], 3000);
};

exports.info = {
    name: 'lesson',
    usage: 'lesson <id>',
    description: 'Shows the lesson with the given id'
};