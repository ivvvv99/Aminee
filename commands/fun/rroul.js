module.exports = {
    name: "roulette",
    aliases: ["russian", "rr"],
    category: "fun",

    async execute(sock, msg) {
        try {
            const jid = msg.key.remoteJid;

            // 🎯 TARGET SYSTEM (reply > mention > self)
            let target;

            const ctx = msg.message?.extendedTextMessage?.contextInfo;

            if (ctx?.participant) {
                // reply
                target = ctx.participant;
            } else if (ctx?.mentionedJid && ctx.mentionedJid.length > 0) {
                // mention
                target = ctx.mentionedJid[0];
            } else {
                // fallback
                target = msg.key.participant || msg.key.remoteJid;
            }

            const bullet = Math.floor(Math.random() * 6);

            // 🎭 suspense
            await sock.sendMessage(jid, {
                text: `🔫 @${target.split("@")[0]} ta7t ti7i 😋`,
                mentions: [target]
            }, { quoted: msg });

            if (bullet === 0) {
                // 💀 death
                await sock.sendMessage(jid, {
                    text: `💀 jat fik d9a 😭`,
                    mentions: [target]
                }, { quoted: msg });

                await sock.groupParticipantsUpdate(jid, [target], "remove");

            } else {
                // 😮‍💨 survived
                await sock.sendMessage(jid, {
                    text: `😮‍💨 njiti mn l mot 😭`,
                    mentions: [target]
                }, { quoted: msg });
            }

        } catch (err) {
            console.log("roulette error:", err);
        }
    }
};
