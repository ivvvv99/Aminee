const path = require('path');
const fs = require('fs');
const { getMessages, clearMessages, trackMessage } = require('./msgtracker');

module.exports = {
  name: 'kick',
  aliases: ['hbt_t7wa', 'hbt_t9wd', '9wd', 'برا', 'اطلع', 'قود', 'هبط', 'kick'],
  category: 'admin',
  groupOnly: true,
  botAdminNeeded: true,

  async execute(sock, msg, args, extra) {
    try {
      const chatId = extra.from;

      const ctx = msg.message?.extendedTextMessage?.contextInfo;
      const mentioned = ctx?.mentionedJid || [];
      let usersToKick = [];

      if (mentioned.length > 0) {
        usersToKick = mentioned;
      } else if (ctx?.participant && ctx.quotedMessage) {
        usersToKick = [ctx.participant];
      }

      if (usersToKick.length === 0) {
        return extra.reply('👤 mention chi wahed wla reply 3lih');
      }

      const botId = sock.user?.id || '';
      usersToKick = usersToKick.filter(u => u !== botId);

      for (let user of usersToKick) {

        // 🔥 STEP 1: DELETE HIS MESSAGES (PURGE ENGINE)
        const messages = getMessages(user);

        for (let key of messages) {
          try {
            await sock.sendMessage(chatId, { delete: key });
          } catch {}
        }

        // 🧹 clear cache
        clearMessages(user);

        // 🔥 STEP 2: VIDEO + DYNAMIC MENTION
        const videoPath = path.join(__dirname, '../admin/sdam7sin.mp4');
        const userNumber = user.split('@')[0];

        if (fs.existsSync(videoPath)) {
          await sock.sendMessage(chatId, {
            video: fs.readFileSync(videoPath),
            mimetype: 'video/mp4',
            caption: `@${userNumber} تم طرد الزامل بوك 🤤`,
            mentions: [user]
          }, { quoted: msg });
        }

        // ⏳ delay باش العمليات يتزامنو (network latency buffer)
        await new Promise(r => setTimeout(r, 2000));

        // 🔥 STEP 3: KICK (FINAL EXECUTION)
        await sock.groupParticipantsUpdate(chatId, [user], 'remove');
      }

    } catch (error) {
      console.error('Super Kick Error:', error);
      await extra.reply('❌ error: make sure im admin');
    }
  },
};
