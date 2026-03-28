module.exports = {
    name: "admluck",
    aliases: ["luck"], // 👈 clean af
    category: "admin",
    description: "Give admin randomly",

    async execute(sock, msg) {
        try {
            const jid = msg.key.remoteJid;

            const metadata = await sock.groupMetadata(jid);
            const participants = metadata.participants;

            const filtered = participants.filter(p => {
                return !p.admin && p.id !== sock.user.id;
            });

            if (filtered.length === 0) {
                return sock.sendMessage(jid, {
                    text: "⚠️ ماكاين حتى شي واحد يستاهل الحظ 😂"
                }, { quoted: msg });
            }

            const randomIndex = Math.floor(Math.random() * filtered.length);
            const target = filtered[randomIndex].id;

            await sock.sendMessage(jid, {
                text: `👑 @${target.split("@")[0]} زهر عليك ووليتي admin 😭`,
                mentions: [target]
            }, { quoted: msg });

            await sock.groupParticipantsUpdate(jid, [target], "promote");

        } catch (err) {
            console.log("admluck error:", err);
        }
    }
};
