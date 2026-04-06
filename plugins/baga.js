const { cmd } = require('../command');
const config = require('../config');
const os = require("os");
const { runtime } = require('../lib/functions');

// Fake vCard එක මෙතන තියෙන්න ඕනි
const fakevCard = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "© Mr Hiruka",
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Meta\nORG:META AI;\nTEL;type=CELL;type=VOICE;waid=94762095304:+94762095304\nEND:VCARD`
        }
    }
};

cmd({
    pattern: "baga",
    alias: ["sinfob", "platforbm", "systemstnatus", "systehminfo"],
    react: "🧬",
    desc: "Check bot system status with payment style.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, {
    from, quoted, reply, sender
}) => {
    try {
        // System දත්ත ලබා ගැනීම
        const uptimeStr = runtime(process.uptime());
        const usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
        
        // Caption එක සකස් කිරීම
        const statusText = `╭─〔 *🍷 SYSTEM INFO 🍷*〕─◉
│
│⏰ *Uptime*: ${uptimeStr}
│⏳ *Ram*: ${usedRam}MB / ${totalRam}MB
│🖥 *Host*: ${os.hostname()}
│🖊 *Prefix*: [ ${config.PREFIX} ]
│🛠 *Mode*: [ ${config.MODE} ] 
│🤵‍♂ *Owner*: ᴴᴵᴿᵁᴷᴬ ᴿᴬᴺᵁᴹᴵᵀᴴᴬ
│🧬 *Version*: ${config.BOT_VERSION}
╰─────────────────────────────⊷
> © Powerd by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;

        // Payment Message එක යැවීම
        await robin.sendMessage(from, {
            requestPaymentMessage: {
                currencyCodeIso4217: 'USD',
                amount1000: 999000, 
                requestFrom: sender,
                noteMessage: {
                    extendedTextMessage: {
                        text: statusText,
                        contextInfo: {
                            mentionedJid: [sender],
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363317972190466@newsletter',
                                newsletterName: '𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗',
                                serverMessageId: 143
                            }
                        }
                    }
                }
            }
        }, { quoted: fakevCard });

    } catch (e) {
        console.log("System Error:", e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
