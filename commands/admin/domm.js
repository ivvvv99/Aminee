module.exports = {
    name: "domm",
    aliases: ["li_jat_fih_l7wya"],
    category: "admin",
    description: "Kick random member",

    async execute(sock, msg) {
        try {
            const jid = msg.key.remoteJid;

            // جيب participants
            const metadata = await sock.groupMetadata(jid);
            const participants = metadata.participants;

            // فلتر: حيّد البوت و admins
            const filtered = participants.filter(p => {
                return !p.admin && p.id !== sock.user.id;
            });

            if (filtered.length === 0) {
                return sock.sendMessage(jid, {
                    text: "⚠️ ماكاين حتى شي victim 😂"
                }, { quoted: msg });
            }

            // 🎯 RANDOM SELECTION (uniform distribution)
            const randomIndex = Math.floor(Math.random() * filtered.length);
            const target = filtered[randomIndex].id;

            // message قبل الطرد
            await sock.sendMessage(jid, {
                text: `😂 @${target.split("@")[0]} جا فيك الدور`,
                mentions: [target]
            }, { quoted: msg });

            // 🚀 kick
            await sock.groupParticipantsUpdate(jid, [target], "remove");

        } catch (err) {
            console.error("domm error:", err);
        }
    }
};
