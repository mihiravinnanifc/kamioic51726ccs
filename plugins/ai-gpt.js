const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "gpt",
    alias: ["chatgpt","openai","ai2"],
    desc: "Chat with GPT AI",
    category: "ai",
    react: "🤖",
    filename: __filename
},
async (conn, mek, m, { from, q, react }) => {
    try {

        let userText = q;

        // ✅ If no text, check replied message safely
        if (!userText) {
            if (mek.message?.extendedTextMessage?.contextInfo?.quotedMessage) {

                const quotedMsg =
                    mek.message.extendedTextMessage.contextInfo.quotedMessage;

                userText =
                    quotedMsg.conversation ||
                    quotedMsg.extendedTextMessage?.text ||
                    quotedMsg.imageMessage?.caption ||
                    quotedMsg.videoMessage?.caption;
            }
        }

        // ❌ Still no text
        if (!userText) {
            return conn.sendMessage(from, {
                text: `🧠 *Please provide a message for the AI.*

📌 Example:
• .gpt Hello
• Reply to a message and type .gpt`
            }, { quoted: mek });
        }

        await react("⏳");

        const apiUrl = `https://malvin-api.vercel.app/ai/gpt-5?text=${encodeURIComponent(userText)}`;

        const { data } = await axios.get(apiUrl);

        if (!data?.result) {
            await react("❌");
            return conn.sendMessage(from, { text: "AI failed to respond." }, { quoted: mek });
        }

        await conn.sendMessage(from, {
            text: `🤖 *GPT-5 AI Response*\n\n${data.result}`
        }, { quoted: mek });

        await react("✅");

    } catch (err) {
        console.log(err);
        await react("❌");
        conn.sendMessage(from, { text: "Error communicating with AI." }, { quoted: mek });
    }
});
