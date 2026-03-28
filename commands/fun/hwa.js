module.exports = {
  name: 'hwa',
  aliases: ['mmkn'],
  category: 'fun',
  description: 'Reply with mention',

  async execute(sock, msg, args, extra) {
    try {
      const chatId = msg.key.remoteJid;

      const ctx = msg.message?.extendedTextMessage?.contextInfo;
      const mentioned = ctx?.mentionedJid || [];

      let target;

      // If mentioned
      if (mentioned.length > 0) {
        target = mentioned[0];
      }
      // If replied to someone
      else if (ctx?.participant) {
        target = ctx.participant;
      } else {
        return extra.reply('mention or reply to someone');
      }

      const text = `@${target.split('@')[0]} momkin t3tini xi 7awya 😍👉👈`;

      await sock.sendMessage(chatId, {
        text,
        mentions: [target]
      }, { quoted: msg });

    } catch (err) {
      console.log(err);
      extra.reply('error');
    }
  }
};
