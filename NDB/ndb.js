/**
 * Including required NodeJS Modules
 */
var irc = require("irc"); // IRC Module

var fs = require("fs"); // File System Module

var mysql = require("mysql"); // MySQL Module

/**
 * Instantiating the bot
 */
var vbot = new irc.Client('newyork.nationchat.net', 'NDB', {

    userName: 'database',

    realName: 'NationCHAT Database Service (Only for Opers)',

    channels: ['#services'],

    autoRejoin: true

});