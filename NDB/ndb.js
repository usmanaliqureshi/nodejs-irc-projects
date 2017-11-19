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

    ndb.send('mode', vbot.nick, '+oiwsgxnIWazrh');

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
