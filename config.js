module.exports = {
    ownerNumber: [
        '212760032378@s.whatsapp.net',
        '212706787022@s.whatsapp.net',
        
    ],
    ownerName: ['Amin', 'محمد',],

    botName: '99bot',
    prefix: '.',
    sessionName: 'session',
    sessionID: process.env.SESSION_ID || '',
    newsletterJid: '120363161513685998@newsletter',
    updateZipUrl: 'https://github.com/mruniquehacker/KnightBot-Mini/archive/refs/heads/main.zip',

    packname: 'AmineBotPack',

    selfMode: true,
    autoRead: false,
    autoTyping: false,
    autoBio: false,
    autoSticker: false,
    autoReact: false,
    autoReactMode: 'bot',
    autoDownload: false,

    defaultGroupSettings: {
      antilink: false,
      antilinkAction: 'warn',
      antitag: false,
      antitagAction: 'delete',
      antiall: false,
      antiviewonce: false,
      antibot: false,
      anticall: false,
      antigroupmention: false,
      antigroupmentionAction: 'delete',
      welcome: false,
      welcomeMessage: '╭╼━≪•NEW MEMBER•≫━╾╮\n┃WELCOME: @user 👋\n┃Member count: #memberCount\n╰━━━━━━━━━━━━━━━╯',
      goodbye: false,
      goodbyeMessage: '@user تم الطرد',
      antiSpam: false,
      antidelete: false,
      nsfw: false,
      detect: false,
      chatbot: false,
      autosticker: false
    },

    apiKeys: {
      openai: '',
      deepai: '',
      remove_bg: ''
    },

    messages: {
      wait: '⏳ Please wait...',
      success: '✅ Success!',
      error: '❌ Error occurred!',
      ownerOnly: 'sir awa t7wa😆',
      adminOnly: 'hak wa7d zb',
      groupOnly: '👥 This command can only be used in groups!',
      privateOnly: '💬 This command can only be used in private chat!',
      botAdminNeeded: 'pass admin t7wa 😒',
      invalidCommand: '❓ Invalid command! Type .menu for help'
    },

    timezone: 'Asia/Kolkata',
    maxWarnings: 3,

    social: {
      github: 'https://github.com/mruniquehacker',
      instagram: 'https://instagram.com/yourusername',
      youtube: 'http://youtube.com/@mr_unique_hacker'
    }
};
