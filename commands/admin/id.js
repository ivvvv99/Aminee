module.exports = {
  name: 'myid',
  aliases: ['id'],
  category: 'utility',
  async execute(sock, msg, extra) {
    try {
      const sender = msg.key.participant || msg.key.remoteJid;

      // send reply using sock.sendMessage
      await sock.sendMessage(msg.key.remoteJid, {
        text: `📌 Your JID is:\n${sender}`
      }, { quoted: msg });

    } catch (err) {
      console.error(err);
      await sock.sendMessage(msg.key.remoteJid, { text: '❌ Failed to get your ID.' }, { quoted: msg });
    }
  }
};
