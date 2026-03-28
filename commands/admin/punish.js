/**
 * Punish System (Timed + Safe + Optimized)
 */

const OWNER = '212760017377@s.whatsapp.net';

// memory store
const punished = new Map();

// cache ديال admins باش ما نعيطوش للـ API كل مرة
const adminCache = new Map();

async function getAdmins(sock, jid) {
  if (adminCache.has(jid)) return adminCache.get(jid);

  const metadata = await sock.groupMetadata(jid);
  const admins = metadata.participants
    .filter(p => p.admin)
    .map(p => p.id);

  adminCache.set(jid, admins);

  // refresh كل 5 دقايق
  setTimeout(() => adminCache.delete(jid), 5 * 60 * 1000);

  return admins;
}

module.exports = {
  name: 'punish',
  category: 'admin',

  async execute(sock, msg, args, extra) {
    try {
      const ctx = msg.message?.extendedTextMessage?.contextInfo;
      const mentioned = ctx?.mentionedJid || [];

      let target;

      if (mentioned.length > 0) {
        target = mentioned[0];
      } else if (ctx?.participant) {
        target = ctx.participant;
      }

      if (!target) {
        return extra.reply('👤 mention chi wahed');
      }

      // ⏳ الوقت (minutes)
      const time = parseInt(args[0]) || 1;
      const duration = time * 60 * 1000;

      punished.set(target, Date.now() + duration);

      await extra.reply(
        `😈 @${target.split('@')[0]} punished for ${time} min`,
        { mentions: [target] }
      );

    } catch (e) {
      console.log('punish cmd error:', e.message);
    }
  },

  // 🔥 real-time listener
  async onMessage(sock, msg) {
    try {
      const jid = msg.key.remoteJid;
      if (!jid || !jid.endsWith('@g.us')) return;

      const sender = msg.key.participant || msg.key.remoteJid;
      const botId = sock.user.id;

      // ❌ protect owner + bot
      if (sender === OWNER || sender === botId) return;

      // ❌ protect admins (cached)
      const admins = await getAdmins(sock, jid);
      if (admins.includes(sender)) return;

      // ⏳ check punish
      if (!punished.has(sender)) return;

      const expire = punished.get(sender);

      // 🧹 expired → remove
      if (Date.now() > expire) {
        punished.delete(sender);
        return;
      }

      // 💣 delete message instantly
      await sock.sendMessage(jid, {
        delete: msg.key
      });

    } catch (e) {
      console.log('punish error:', e.message);
    }
  }
};
