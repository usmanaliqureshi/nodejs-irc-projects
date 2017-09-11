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
var con = mysql.createPool({

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

    vbot.send('oper', credentials.login, credentials.password);

    vbot.send('sethost', 'request', 'vhost.service');

    vbot.send('mode', vbot.nick, '+oiwsgxnIWazrh');

    vbot.join('#services ' + credentials.servicekey);

    if (vbot.nick != 'V') {

        vbot.send('kill', 'V', 'Nick Chaser killed by V');

        vbot.send('nick', 'V');

    }

});

/**
 * Detecting a kill and chasing the nickname.
 * @param  nick     [nickname of the user who is killed]
 * @param  reason   [the reason of the kline]
 * @param  channels [an array of all the channels the user was on]
 * @param  message  [the error]
 */
vbot.addListener('kill', function(nick, reason, channels, message) {

    if (nick == 'V') setTimeout(function() {

        vbot.send('nick', 'V');

        console.log('Nick Chased');

    }, 3000);

});

/**
 * Detecting a quit and chasing the nickname.
 * @param  nick     [nickname of the user who just quitted]
 * @param  reason   [the reason of quitting]
 * @param  channels [an array of all the channels the user was present in]
 * @param  message  [the error]
 */
vbot.addListener('quit', function (nick, reason, channels, message) {

    if (nick == 'V') setTimeout(function(){ 
        
        vbot.send('nick', 'V');

        console.log('Nick Chased');

     }, 3000);

});

/**
 * The bot will give itself an operator status ( +o )
 * @param  channel  [the irc channel which the bot just joined]
 * @param  nick     [nick to detect]
 * @param  message) { if ( nick === botnick [then the bot will give itself an operator status]
 */
vbot.addListener('join', function(channel, nick, message) {

    if (nick === vbot.nick) {

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

/**
 * This is the request handler which processes the vhost request for the user who requested it by the command /msg V request host password
 * @param  nick     [nickname of the user who sent the private message]
 * @param  text     [the message sent by the nick]
 * @param  message  [message]
 * @return [notice] [based on the hostname process]
 */
vbot.addListener('pm', function(nick, text, message) {

    vbot.whois(nick, function(info) {

        var result = detectuserhost(info.host, "users.nationchat.org");

        if (result == 'users.nationchat.org') {

            msg = text.split(" ")

            switch (true) {

                case (msg[0] == "request"):

                    switch (true) {

                        case ((msg[1] === null) || (msg[1] === undefined)):

                            vbot.notice(nick, 'The correct syntax is /msg V request <hostname> <password>');

                            return

                            break;

                        case ((msg[2] === null) || (msg[2] === undefined)):

                            vbot.notice(nick, 'The correct syntax is /msg V request <hostname> <password>');

                            return

                            break;

                    }

                    var sql = 'SELECT * FROM hostnames WHERE vhost = ' + mysql.escape(msg[1]);

                    con.getConnection(function (erro, connection) {

                        if (erro) console.log(erro);

                        connection.query(sql, function (err, result) {

                            if (err) console.log(err);

                            if (typeof result != "undefined" && result != null && result.length != null && result.length > 0) {

                                vbot.notice(nick, 'The vhost you are requesting has been assigned to a different user. Please request a different vhost.');

                            } else {

                                vbot.say('H', 'ADD ' + nick + ' *!*@* ' + msg[1] + ' ' + msg[2]);

                                vbot.notice(nick, 'Congratulations, your hostname is approved successfully.');

                                vbot.notice(nick, 'If you want to use your hostname please type /msg H login ' + nick + ' ' + msg[2]);

                                vbot.say('#services', 'VHOST: ' + msg[1] + ' is APPROVED for ' + nick);

                                var sql = "INSERT INTO hostnames (nick, vhost) VALUES (" + mysql.escape(nick) + ", " + mysql.escape(msg[1]) + ")";

                                connection.query(sql, function (error, result) {

                                    if (error) console.log(error);

                                });

                            }

                        });

                        connection.release()

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

    var matchfound = new RegExp("\\w*" + hostmask + "\\w*", "g");

    return userhost.match(matchfound);

}

vbot.addListener('error', function(message) {

    console.log('error: ', message);

});
