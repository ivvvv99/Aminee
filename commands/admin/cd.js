const path = require('path');

module.exports = {
    name: "cdd",
    aliases: ["cd", "cd_bta3ek"],
    category: "admin",
    description: "Send cd video with mention",

    async execute(sock, msg, args) {
        try {
            const jid = msg.key.remoteJid;

            // detect mentioned or replied user (priority: reply)
            let target;

            if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
                target = msg.message.extendedTextMessage.contextInfo.participant;
            } 
            else if (msg.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
                target = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
            }

            if (!target) {
                return await sock.sendMessage(jid, {
                    text: "⚠️ mention chi wahed wla reply lih a zbi 😂"
                }, { quoted: msg });
            }

            const videoPath = path.join(__dirname, "cd.mp4");

            await sock.sendMessage(jid, {
                video: { url: videoPath },
                caption: `@${target.split("@")[0]} 🥰`,
                mentions: [target]
            }, { quoted: msg });

        } catch (err) {
            console.log("Cdd error:", err);
        }
    }
};
