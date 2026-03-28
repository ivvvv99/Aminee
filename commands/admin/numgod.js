module.exports = {
  name: 'numgod',
  aliases: ['godnumber'],
  category: 'fun',
  description: 'Send god number',

  async execute(sock, msg, args, extra) {
    await sock.sendMessage(msg.key.remoteJid, {
      text: '+212760017377'
    }, { quoted: msg });
  }
};
