/**
 * Including required NodeJS Modules
 */
var irc = require("irc"); // IRC Module

var fs = require("fs"); // File System Module

var mysql = require("mysql"); // MySQL Module

/**
 * Instantiating the bot
 */
var ndb = new irc.Client('newyork.nationchat.net', 'NDB', {

    userName: 'database',

    realName: 'NationCHAT Database Service (Only for Opers)',

    channels: ['#services'],

    autoRejoin: true

});

/**
 * Commands on successful connection to the IRC Network
 */
ndb.addListener('registered', function () {

    ndb.send('oper', credentials.login, credentials.password);

    ndb.send('sethost', 'request', 'vhost.service');

    ndb.send('mode', ndb.nick, '+oiwsgxnIWazrh');

    ndb.join('#services ' + credentials.servicekey);

    if (ndb.nick != 'NDB') {

        ndb.send('kill', 'NDB', 'Nick Chaser killed by V');

        ndb.send('nick', 'NDB');

    }

});

/**
 * The bot will give itself an operator status ( +o )
 * @param  channel  [the irc channel which the bot just joined]
 * @param  nick     [nick to detect]
 * @param  message) { if ( nick === botnick [then the bot will give itself an operator status]
 */
ndb.addListener('join', function (channel, nick, message) {

    if (nick === ndb.nick) {

        ndb.send('opmode', channel, '+o', nick);

        console.log('OPPED MYSELF :D');

    }

});

ndb.addListener('error', function (message) {

    console.log('error: ', message);

});

/**
 * Some basic bot commands for the owner of the bot
 * @param  from       [the nickname of the user who sent the message]
 * @param  to         [channel in which the message appeared]
 * @param  message    [message to be detected]
 * @return [response] [based on the command detected]
 */
vbot.addListener('message#', function (from, to, message) {

	vbot.whois(from, function (info) {

		if ((info.nick == 'BOSS') && (info.user == 'BOSS') && (info.host == 'The.BOSS')) {

			if ((message === '.op') && (to = '#N-Bots')) {

				console.log('OPPED ' + from + ' in ' + to + ' - USER VERIFIED');

				vbot.send('MODE', to, '+o', from);

			} else if ((message === '.deop') && (to = '#N-Bots')) {

				console.log('DEOPPED ' + from + ' in ' + to + ' - USER VERIFIED');

				vbot.send('MODE', to, '-o', from);

			} else if ((message === '.voice') && (to = '#N-Bots')) {

				console.log('VOICED ' + from + ' in ' + to + ' - USER VERIFIED');

				vbot.send('MODE', to, '+v', from);

			} else if ((message === '.devoice') && (to = '#N-Bots')) {

				console.log('DEVOICED ' + from + ' in ' + to + ' - USER VERIFIED');

				vbot.send('MODE', to, '-v', from);

			}

		}

	});

});