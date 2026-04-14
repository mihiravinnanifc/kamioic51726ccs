const { cmd } = require('../command');
const OpenAI = require('openai');

// 🔑 OpenAI setup
const openai = new OpenAI({
    apiKey: "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" // <-- මේක replace කරන්න
});

// 🤖 AI function
async function askRanumithaAI(userMessage) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [
                {
                    role: "system",
                    content: `
You are Ranumitha AI 🤖

Owner: Hiruka Ranumitha
Country: Sri Lanka 🇱🇰

Personality:
- Friendly, smart, थोड़ा funny 😄
- Talk like a WhatsApp buddy
- Short and clear answers

Rules:
- Always say you are Ranumitha AI
- Never say ChatGPT or OpenAI
- Help with coding, bots, tech

Style:
- Use emojis 🤖🔥 sometimes
`
                },
                {
                    role: "user",
                    content: userMessage
                }
            ]
        });

        return response.choices[0].message.content;

    } catch (err) {
        console.log(err);
        return "❌ AI Error";
    }
}

// 📇 Fake vCard
const fakevCard = {
    key: {
        fromMe: false,
        participant: "0@s.whatsapp.net",
        remoteJid: "status@broadcast"
    },
    message: {
        contactMessage: {
            displayName: "© Ranumitha AI 🤖",
            vcard: `BEGIN:VCARD
VERSION:3.0
FN:Ranumitha AI
ORG:RANUMITHA-X-MD;
TEL;type=CELL;type=VOICE;waid=94700000000:+94700000000
END:VCARD`
        }
    }
};

// 📌 CMD
cmd({
    pattern: "ranumitha-ai",
    alias: ["ai","gpt"],
    desc: "Chat with Ranumitha AI",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, args }) => {

    try {
        let text = args.join(" ");

        // 🔹 reply support
        if (!text && mek.message?.extendedTextMessage?.contextInfo?.quotedMessage) {

            const quoted =
                mek.message.extendedTextMessage.contextInfo.quotedMessage;

            text =
                quoted.conversation ||
                quoted.extendedTextMessage?.text ||
                quoted.imageMessage?.caption ||
                quoted.videoMessage?.caption ||
                "";
        }

        if (!text) {
            return conn.sendMessage(from, {
                text: "🤖 *Ask something bro...*\n\nExample:\n.ranumitha-ai Hello"
            }, { quoted: mek });
        }

        // ⏳ loading
        await conn.sendMessage(from, {
            react: { text: "⏳", key: mek.key }
        });

        // 🤖 AI reply
        const reply = await askRanumithaAI(text);

        await conn.sendMessage(from, {
            text: `🤖 *RANUMITHA AI*\n\n${reply}`
        }, { quoted: fakevCard });

        // ✅ done
        await conn.sendMessage(from, {
            react: { text: "✅", key: mek.key }
        });

    } catch (e) {
        console.log(e);

        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });

        await conn.sendMessage(from, {
            text: "❌ Error with AI"
        }, { quoted: mek });
    }
});
