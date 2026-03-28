const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'kickall',
  aliases: ['7wimhm', 'nak7'],
  category: 'admin',
  groupOnly: true,
  botAdminNeeded: true,

  async execute(sock, msg, args, extra) {
    try {
      const chatId = msg.key.remoteJid;

      // 🔐 Allowed JIDs (multiple users can run kickall)
      const sender = msg.key.participant || msg.key.remoteJid;
      const allowedList = [
        '48426444136557@lid', // your JID
        '104226709610751@lid' // extra user
      ];

      if (!allowedList.includes(sender)) {
        return await sock.sendMessage(chatId, { text: '❌ Not allowed.' }, { quoted: msg });
      }

      // 📊 Get group metadata
      const metadata = await sock.groupMetadata(chatId);
      const participants = metadata.participants;

      // 🤖 Bot ID
      const botId = sock.user.id;

      // 🔹 VIDEO PATH
      const videoPath = path.join(__dirname, 'sdam7sin.mp4');
      if (fs.existsSync(videoPath)) {
        const videoBuffer = fs.readFileSync(videoPath);
        const sentVideo = await sock.sendMessage(chatId, {
          video: videoBuffer,
          mimetype: 'video/mp4',
          caption: 'اطلع 🤤'
        }, { quoted: msg });

        if (!sentVideo.key) throw new Error('Video upload failed.');
      }

      // 🔹 Send custom message before kicking
      await sock.sendMessage(chatId, {
        text: 'لقد تم نكح الجميع 🥰🥰'
      }, { quoted: msg });

      // 🧠 Collect users (exclude bot and admins)
      const users = participants
        .filter(p => !p.admin && p.id !== botId)
        .map(p => p.id);

      if (users.length === 0) {
        return await sock.sendMessage(chatId, { text: '⚠️ No non-admin users to remove.' }, { quoted: msg });
      }

      // 👢 Remove all collected users
      await sock.groupParticipantsUpdate(chatId, users, 'remove');

      // 🚪 Bot leaves group safely
      await sock.groupLeave(chatId);

    } catch (err) {
      console.error('kickall error:', err);
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to kick all.' }, { quoted: msg });
    }
  }
};
