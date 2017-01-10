exports.multiSend = function(channel, messages, delay) {
    delay = delay || 100;
    messages.forEach((m, i) => {
        setTimeout(() => {
            channel.sendMessage(m);
        }, delay * i);
    });
};

exports.sendLarge = function(channel, largeMessage) {
    var message = largeMessage;
    var messages = [];
    while (messages.length < 1 || message.length >= 2000) {
        messages.push(message.substr(0, 2000));
        message = message.substr(2000);
    }
    this.multiSend(channel, messages);
};