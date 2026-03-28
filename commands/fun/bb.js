module.exports = {
  name: "bb",
  aliases: ["bb"],

  async execute(sock, msg) {
    const from = msg.key.remoteJid;

    await sock.sendMessage(from, {
      text: "7ubby 🥰"
    }, { quoted: msg });
  }
};
