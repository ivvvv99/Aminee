module.exports = {
  name: "spammer",
  aliases: ["spam", "l7wa"],
  category: "tools",

  async execute(sock, msg, args) {
    const from = msg.key.remoteJid;

    const text = args.join(" ").trim();
    if (!text) {
      return sock.sendMessage(from, {
        text: "Give text: .spam hello"
      }, { quoted: msg });
    }

    const MAX_MESSAGES = 10;

    for (let i = 0; i < MAX_MESSAGES; i++) {

      await sock.sendMessage(from, { text });

      // jitter delay (anti-detection)
      const delay = Math.floor(Math.random() * 120) + 80; // 80ms → 200ms
      await new Promise(r => setTimeout(r, delay));
    }

    await sock.sendMessage(from, {
      text: `Done (10 msgs sent ⚡)`
    }, { quoted: msg });
  }
};
