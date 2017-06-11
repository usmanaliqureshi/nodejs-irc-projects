/**
 * Including required NodeJS Modules
 */
var irc = require("irc");

var fs = require("fs");

var mysql = require("mysql");

var credentials = require("./credentials.json");

/**
 * Connecting to MySQL Database and selecting the Database
 */
var con = mysql.createConnection({

    host: "localhost",

    user: credentials.MySQL_USERNAME,

    password: credentials.MySQL_PASSWORD,

    database: credentials.MySQL_DATABASE

});

/**
 * Instantiating the bot
 */
var vbot = new irc.Client('newyork.nationchat.org', 'V', {

	userName: 'request',

    realName: 'Virtual Host Request Service',

    channels: ['#Help', '#services'],

    autoRejoin: true,

});

/**
 * Commands on successful connection to the IRC Network
 */
vbot.addListener('registered', function() {

	fs.readFile('./credentials.json', 'utf-8', function(error, credentials) {

		credentials =  JSON.parse(credentials);

		vbot.send('oper', credentials.login, credentials.password);

		vbot.send('sethost', 'request', 'vhost.service');

		vbot.send('mode', vbot.nick, '+oiwksgxnIWazrh');

		vbot.join('#services ' + credentials.servicekey);

	});

});

/**
 * The bot will give itself an operator status ( +o )
 * @param  channel  [the irc channel which the bot just joined]
 * @param  nick     [nick to detect]
 * @param  message) { if ( nick === botnick [then the bot will give itself an operator status]
 */
vbot.addListener('join', function(channel, nick, message) {

	if ( nick === vbot.nick ) {

		vbot.send('opmode', channel, '+o', nick);

	}

});

/**
 * Some basic bot commands for the owner of the bot
 * @param  from       [the nickname of the user who sent the message]
 * @param  to         [channel in which the message appeared]
 * @param  message    [message to be detected]
 * @return [response] [based on the command detected]
 */
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

/**
 * Thi sis the request handler which processes the vhost request for the user who requested it by the command /msg V request host password
 * @param  nick     [nickname of the user who sent the private message]
 * @param  text     [the message sent by the nick]
 * @param  message  [message]
 * @return [notice] [based on the hostname process]
 */
vbot.addListener('pm', function(nick, text, message) {

	vbot.whois(nick, function(info) {

	var result = detectuserhost(info.host, "users.nationchat.org");

        if ( result == 'users.nationchat.org' ) {

        	msg = text.split(" ")

        	switch (msg[0]) {

        	    case "request":

        	        var sql = 'SELECT * FROM hostnames WHERE vhost = ' + mysql.escape(msg[1]);

        	        con.query(sql, function(err, result) {

        	            if (typeof result != "undefined" && result != null && result.length != null && result.length > 0) {

        	                vbot.notice(nick, 'The vhost you are requesting has been assigned to a different user. Please request a different vhost.');

        	            } else {

        	                vbot.say('H', 'ADD ' + nick + ' *!*@* ' + msg[1] + ' ' + msg[2]);

        	                vbot.notice(nick, 'Congratulations, your hostname is approved successfully.');

        	                vbot.notice(nick, 'If you want to use your hostname please type /msg H login ' + nick + ' ' + msg[2]);

        	                vbot.say('#services', 'VHOST: ' + msg[1] + ' is APPROVED for ' + nick);

        	                var sql = "INSERT INTO hostnames (nick, vhost) VALUES (" + mysql.escape(nick) + ", " + mysql.escape(msg[1]) + ")";

        	                con.query(sql, function(error, result) {

        	                    if (error) console.log(error);

        	                });

        	            }

        	        });

        	    break;

        	}


        } else {

        	vbot.notice(nick, 'You must be logged in to request a vhost.');

        	vbot.notice(nick, 'If you are logged in then type /mode ' + nick + ' +x to hide your host and then try again.');

        }

	});

});

/**
 * A case sensitive regular expression
 * @param  userhost    [expression to be matched in]
 * @param  hostmask    [expression to match]
 * @return matchfound  [returning the match found]
 */
function detectuserhost(userhost, hostmask) {

    var matchfound = new RegExp("\\w*"+hostmask+"\\w*", "g");

    return userhost.match(matchfound);

}

vbot.addListener('error', function(message) {

    console.log('error: ', message);

});
