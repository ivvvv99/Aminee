const config = require('../../config');

module.exports = {
  // We keep the name for logging, but we'll call this via a listener
  name: 'autokick-rb',
  groupOnly: true,
  botAdminNeeded: true,

  async execute(sock, msg, extra) {
    try {
      const chatId = extra.from;
      const sender = msg.key.participant || msg.key.remoteJid;
      
      // 1. Get message content from various possible locations
      const content = (
        msg.message?.conversation || 
        msg.message?.extendedTextMessage?.text || 
        msg.message?.imageMessage?.caption || ""
      ).toLowerCase().trim();

      if (!content) return;

      // 2. Define Triggers
      const triggers = ['rbk', 'rb', 'rab', 'رب', 'ربك'];
      
      // Using a Word Boundary Regex to avoid kicking for words like "Arab" or "Problem"
      const pattern = new RegExp(`\\b(${triggers.join('|')})\\b`, 'i');
      const isTriggered = pattern.test(content) || triggers.some(t => content === t);

      if (isTriggered) {
        // 3. Fetch Group Metadata to check Admin status
        const metadata = await sock.groupMetadata(chatId);
        const participants = metadata.participants || [];
        
        const botId = sock.user?.id.split(':')[0] + '@s.whatsapp.net';
        const botInfo = participants.find(p => p.id === botId);
        const senderInfo = participants.find(p => p.id === sender);

        // 4. Security Checks
        const botIsAdmin = botInfo?.admin === 'admin' || botInfo?.admin === 'superadmin';
        const senderIsAdmin = senderInfo?.admin === 'admin' || senderInfo?.admin === 'superadmin';
        const isBot = sender === botId;

        if (botIsAdmin && !senderIsAdmin && !isBot) {
          console.log(`[AUTO-KICK] Triggered by ${sender} for word: ${content}`);

          // Kick the user
          await sock.groupParticipantsUpdate(chatId, [sender], 'remove');

          // Confirmation message
          const text = `@${sender.split('@')[0]} tama tard zaml bok 😋`;
          await sock.sendMessage(chatId, { text, mentions: [sender] });
        }
      }
    } catch (error) {
      // Silently fail to avoid crashing the main loop on metadata errors
      console.error('Auto-kick error:', error);
    }
  },
};

