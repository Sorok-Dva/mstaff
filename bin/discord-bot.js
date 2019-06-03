const discord = require('discord-bot-webhook');

module.exports = (text, bot) => {
  switch (bot) {
    case 'errors':
      discord.hookId = '425665067875434516';
      discord.hookToken = 'thQparT7FGc0O1z34ymoLgHN9gj1esQh4Nym5nksLT1TR6MDifKrKjXZBE1TZ9rXkwIV';
      break;
    case 'infos':
      discord.hookId = '533663856631873547';
      discord.hookToken = 'd0AD1Grkz8qe5Q90sBXpvWyOiEqSnBoQKGjMyBvb_oVqLFdBISzVvVqYhL8CI3SMLnMv';
      break;
    case 'emails':
      discord.hookId = '584036778562813952';
      discord.hookToken = 'DKNYQ24tcEd8enhLKVrSG1mJ1xc7FpRm6YOQ5glFCFjyoD3ouQ_QKV757jqGS84SdLQO';
      break;
  }
  discord.sendMessage(text);
};