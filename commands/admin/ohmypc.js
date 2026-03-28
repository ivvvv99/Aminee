module.exports = {
  name: "ohmypc",
  aliases: ["ohmypc"],

  async execute(sock, msg) {
    const from = msg.key.remoteJid;
    const sender = msg.key.participant || msg.key.remoteJid;

    const start = Date.now();

    // small controlled burst (NOT harmful)
    for (let i = 0; i < 3; i++) {
      await sock.sendMessage(from, {
        text: `⚡ packet ${i + 1} received...`
      });
    }

    const latency = Date.now() - start;

    await sock.sendMessage(from, {
      text: `@${sender.split("@")[0]} system stable 🧠\nlatency: ${latency}ms`,
      mentions: [sender]
    }, { quoted: msg });
  }
};
