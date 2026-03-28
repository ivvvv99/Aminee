const punishUsers = {};

function punishUser(user, duration) {
  punishUsers[user] = Date.now() + duration;
}

module.exports = (sock) => {

  sock.ev.on('messages.upsert', async ({ messages }) => {
    try {
      const msg = messages[0];
      if (!msg.message) return;

      const from = msg.key.remoteJid;
      const sender = msg.key.participant || from;

      // ignore bot نفسه
      if (msg.key.fromMe) return;

      const text =
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        '';

      // =========================
      // 🔥 PUNISH SYSTEM
      // =========================
      if (punishUsers[sender]) {
        if (Date.now() < punishUsers[sender]) {
          await sock.sendMessage(from, { delete: msg.key });
          return;
        } else {
          delete punishUsers[sender];
        }
      }

      // =========================
      // ⚡ COMMANDS
      // =========================

      if (text === '.ping') {
        await sock.sendMessage(from, { text: 'pong' });
      }

      if (text.startsWith('.punish')) {
        punishUser(sender, 60000); // 60 sec
        await sock.sendMessage(from, {
          text: 'You are punished for 60 seconds'
        });
      }

    } catch (e) {
      console.error('script error:', e);
    }
  });

};
