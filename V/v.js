var irc = require("irc");

var fs = require("fs");

var vbot = new irc.Client('newyork.nationchat.org', 'V', {

	userName: 'request',

    realName: 'Virtual Host Request Service',

    channels: ['#Help', '#services'],

    autoRejoin: true,

});

vbot.addListener('registered', function() {

	fs.readFile('./credentials.json', 'utf-8', function(error, credentials) {

		credentials =  JSON.parse(credentials);

		vbot.send('oper', credentials.login, credentials.password);

		vbot.send('sethost', 'request', 'vhost.service');

		vbot.send('mode', vbot.nick, '+oiwksgxnIWazrh');

		vbot.join('#services ' + credentials.servicekey);

	});

});

vbot.addListener('join', function(channel, nick, message) {

	if ( nick === vbot.nick ) {

		vbot.send('opmode', channel, '+o', nick);

	}

});

vbot.addListener('message#', function(from, to, message) {

	vbot.whois(from, function(info) {

		if ( (info.nick == 'BOSS') && (info.user == 'BOSS') && (info.host == 'The.BOSS') ) {

			if ( (message === '.op') && (to = '#N-Bots') ) {

				console.log('OPPED ' + from + ' in ' + to + ' - USER VERIFIED');

				vbot.send('MODE', to, '+o', from);

			} else if ( (message === '.deop') && (to = '#N-Bots') ) {

				console.log('DEOPPED ' + from + ' in ' + to + ' - USER VERIFIED');

				vbot.send('MODE', to, '-o', from);

			} else if ( (message === '.voice') && (to = '#N-Bots') ) {

				console.log('VOICED ' + from + ' in ' + to + ' - USER VERIFIED');

				vbot.send('MODE', to, '+v', from);

			} else if ( (message === '.devoice') && (to = '#N-Bots') ) {

				console.log('DEVOICED ' + from + ' in ' + to + ' - USER VERIFIED');

				vbot.send('MODE', to, '-v', from);

			}

		}

	});

});

vbot.addListener('pm', function(nick, text, message) {

	vbot.whois(nick, function(info) {

	var result = findMatchingWords(info.host, "users.nationchat.org");

        if ( result == 'users.nationchat.org' ) {

        	msg = text.split(" ")

        	switch( msg[0] ) {

        		case "request":

	        		vbot.say('H', 'ADD ' + nick + ' *!*@* ' + msg[1] + ' ' + msg[2]);

	        		vbot.notice(nick, 'Congratulations, your hostname is approved successfully.');

	        		vbot.notice(nick, 'If you want to use your hostname please type /msg H login ' + nick + ' ' + msg[2]);

	        		vbot.say('#services', 'VHOST: ' + msg[1] + ' is APPROVED for ' + nick);

	        		break;

	        	default:

	        		return;

        	}

        } else {

        	vbot.notice(nick, 'You must be logged in to request a vhost.');

        	vbot.notice(nick, 'If you are logged in then type /mode ' + nick + ' +x to hide your host and then try again.');

        }

	});

});

function findMatchingWords(t, s) {

    var re = new RegExp("\\w*"+s+"\\w*", "g");

    return t.match(re);

}

vbot.addListener('error', function(message) {

    console.log('error: ', message);



});
