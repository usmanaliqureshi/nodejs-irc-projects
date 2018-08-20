/**
 * Including required NodeJS Modules
 */
var irc = require("irc"); // IRC Module

var mysql = require("mysql"); // MySQL Module

var credentials = require("./ndb.json"); // JSON Data File

/**
 * Instantiating the bot
 */
var ndb = new irc.Client('newyork.nationchat.org', 'NDB', {

    userName: 'database',

    realName: 'NationCHAT Database Service (Only for Opers)',

    channels: ['#services'],

    autoRejoin: true,

	floodProtection: false,

	floodProtectionDelay: 1000,

	stripColors: true

});

ndb.setMaxListeners(0);

/**
 * Connecting to MySQL Database and selecting the Database
 */
var con = mysql.createPool({

	host: "localhost",

	user: credentials.MySQL_USERNAME,

	password: credentials.MySQL_PASSWORD,

	database: credentials.MySQL_DATABASE

});

/**
 * Commands on successful connection to the IRC Network
 */
ndb.addListener('registered', function () {

    ndb.send('oper', credentials.login, credentials.password);

    ndb.send('sethost', 'user', 'database.service');

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
ndb.addListener('message#', function (from, to, message) {

	ndb.whois(from, function (info) {

		if ((info.nick == 'BOSS') && (info.user == 'BOSS') && (info.host == 'The.BOSS')) {

			if ((message === '.op') && (to = '#services')) {

				console.log('OPPED ' + from + ' in ' + to + ' - USER VERIFIED');

				ndb.send('MODE', to, '+o', from);

			} else if ((message === '.deop') && (to = '#services')) {

				console.log('DEOPPED ' + from + ' in ' + to + ' - USER VERIFIED');

				ndb.send('MODE', to, '-o', from);

			} else if ((message === '.voice') && (to = '#services')) {

				console.log('VOICED ' + from + ' in ' + to + ' - USER VERIFIED');

				ndb.send('MODE', to, '+v', from);

			} else if ((message === '.devoice') && (to = '#services')) {

				console.log('DEVOICED ' + from + ' in ' + to + ' - USER VERIFIED');

				ndb.send('MODE', to, '-v', from);

			}

		} else if( from === 'J' ) {

			var msg = message.split(" ");

			var eventname = msg[0];

			var ip = msg[3].replace(/[()]/g, '');

			var userinfo = ip.split("@");

			var nickname = msg[2];

			var userident = userinfo[0];

			var userhost = userinfo[1];

			//console.log( eventname + ": " + nickname + " " + userident + " " + userhost );

			con.getConnection( function( erro, connection ) {

				if( erro ) console.log( erro );

				var sql = "INSERT INTO userbase (event, nick, ident, hostname) VALUES (" + mysql.escape( eventname ) + ", " + mysql.escape( nickname ) + ", " + mysql.escape( userident ) + ", " + mysql.escape( userhost ) + ")";

				connection.query( sql, function( error, result ) {

					if( error ) console.log( error );

				} );

				connection.release()

			} );

		} else {

			console.log( message );

		}

	});

});
