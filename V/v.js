var irc = require("irc");

var fs = require("fs");

var vbot = new irc.Client('newyork.nationchat.org', 'V', {

    channels: ['#N-Bots'],

});

vbot.addListener('registered', function() {

	fs.readFile('./credentials.json', 'utf-8', function(error, credentials) {

		credentials =  JSON.parse(credentials);

		vbot.send('oper', credentials.login, credentials.password);

		vbot.send('sethost', 'request', 'vhost.service');

		vbot.send('mode', vbot.nick, '+oiwksgxnIWazrh');

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

vbot.addListener('error', function(message) {

    console.log('error: ', message);

});
