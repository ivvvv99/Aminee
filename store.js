// KnightBot-Mini/store.js
const store = {
  // Map: chatId => Map(messageId => message)
  messages: new Map(),

  // Maximum messages to keep per chat
  maxPerChat: 100, // Increase if you want more history

  // Bind the socket event to store messages
  bind: (ev) => {
    ev.on('messages.upsert', ({ messages }) => {
      for (const msg of messages) {
        if (!msg.key?.id) continue;

        const jid = msg.key.remoteJid;
        if (!store.messages.has(jid)) {
          store.messages.set(jid, new Map());
        }

        const chatMsgs = store.messages.get(jid);
        chatMsgs.set(msg.key.id, msg);

        // Keep only the last maxPerChat messages
        if (chatMsgs.size > store.maxPerChat) {
          const oldestKey = chatMsgs.keys().next().value;
          chatMsgs.delete(oldestKey);
        }
      }
    });
  },

  // Load a single message by chatId + messageId
  loadMessage: async (jid, id) => store.messages.get(jid)?.get(id) || null,

  // Get messages for a specific user (works for groups and DMs)
  getUserMessages: (chatId, userId) => {
    const chat = store.messages.get(chatId);
    if (!chat) return [];
    return Array.from(chat.values()).filter(m => {
      // Use participant (group) or remoteJid (DM)
      return (m.key.participant || m.key.remoteJid) === userId;
    });
  }
};

module.exports = { store };
