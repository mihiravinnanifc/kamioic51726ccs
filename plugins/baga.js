const config = require('../config');
const { cmd } = require('../command');
const os = require("os");

// Fake vCard (optional – alive එක වගේ use කරන්න පුළුවන්)
const fakevCard = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "© Mr Hiruka",
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:System
ORG:WHITESHADOW MD;
TEL;type=CELL;type=VOICE;waid=94762095304:+94762095304
END:VCARD`
        }
    }
};

cmd({
    pattern: "systemx",
    alias: ["sysx", "infox"],
    react: "⚙️",
    desc: "Show system info",
    category: "main",
    filename: __filename
},
async (robin, mek, m, {
    from, sender, reply
}) => {
    try {
        await robin.sendPresenceUpdate('recording', from);

        // 🧠 System Data
        const processUptime = process.uptime();
        const uptimeStr = `${Math.floor(processUptime / 3600)}h ${Math.floor((processUptime % 3600) / 60)}m ${Math.floor(processUptime % 60)}s`;

        const usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);

        const sysText = `╭━━━〔 ⚙️ *SYSTEM INFO* 〕━━━╮
┃ 🤖 *BOT:* RANUMITHA-X-MD
┃ ⏱️ *UPTIME:* ${uptimeStr}
┃ 💾 *RAM:* ${usedRam} MB / ${totalRam} GB
┃ 🖥️ *OS:* ${os.type()} ${os.release()}
┃ 🖥️ *HOST:* ${os.hostname()}
╰━━━━━━━━━━━━━━━━━━━━━╯

> © Powerd by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;

        // Sticker (optional)
        let quotedSticker = null;
        if (mek.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage) {
            quotedSticker = mek.message.extendedTextMessage.contextInfo.quotedMessage.stickerMessage;
        }

        // 💸 Payment Style Message
        await robin.sendMessage(from, {
            requestPaymentMessage: {
                currencyCodeIso4217: 'USD',
                amount1000: 499000,
                requestFrom: sender,
                noteMessage: {
                    extendedTextMessage: {
                        text: sysText,
                        contextInfo: {
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363317972190466@newsletter',
                                newsletterName: 'RANUMITHA X MD',
                                serverMessageId: 143
                            }
                        }
                    }
                },
                sticker: quotedSticker || undefined,
                background: {
                    id: 'bg-001',
                    fileLength: '1024',
                    width: 512,
                    height: 512,
                    mimetype: 'image/webp',
                    placeholderArgb: 0xFF00FFFF,
                    textArgb: 0xFFFFFFFF,
                    subtextArgb: 0xFFAA00FF
                }
            }
        }, { quoted: fakevCard });

    } catch (e) {
        console.log("SystemX Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
