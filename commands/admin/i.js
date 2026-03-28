const { store } = require('../../store.js'); // Adjust path if needed

module.exports = {
  name: 'i',
  aliases: ['del', 'mszbi'],
  groupOnly: true,
  botAdminNeeded: true,

  async execute(sock, msg, args, extra) {
    try {
      const chatId = msg.key.remoteJid;

      const ctx = msg.message?.extendedTextMessage?.contextInfo;
      const mentioned = ctx?.mentionedJid || [];

      if (mentioned.length === 0) {
        return extra.reply('Please mention a user.');
      }

      const target = mentioned[0];
      const amount = parseInt(args[0]);

      if (isNaN(amount)) {
        return extra.reply('Please provide a valid number.');
      }

      const userMessages = store.getUserMessages(chatId, target);

      if (userMessages.length === 0) {
        return extra.reply('No messages found for this user.');
      }

      const toDelete = userMessages.slice(-amount);

      for (const m of toDelete) {
        await sock.sendMessage(chatId, {
          delete: m.key
        });
      }

      await sock.sendMessage(chatId, {
        text: `Deleted ${toDelete.length} message(s) from @${target.split('@')[0]}`,
        mentions: [target]
      });

    } catch (err) {
      console.log(err); // For debugging
      extra.reply('System error occurred.');
    }
  }
};
