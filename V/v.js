var irc = require("irc");

var vbot = new irc.Client('newyork.nationchat.org', 'V', {
    channels: ['#N-Bots'],
});

vbot.addListener('error', function(message) {
    console.log('error: ', message);
});
