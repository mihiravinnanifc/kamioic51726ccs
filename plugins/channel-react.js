const fetch = require("node-fetch");
const { cmd } = require("../command");

const BOT_API_KEY = "ADD_YOUR_API_KEY_HERE";

cmd({
    pattern: "rch", // 🔥 MAIN COMMAND
    alias: ["reactch", "creact"],
    desc: "Bot self multi react to channel",
    category: "owner",
    filename: __filename
}, async (conn, m) => {
    try {
        // 🔐 SELF / OWNER ONLY
        if (!m.fromMe && !m.isOwner) return;

        const text =
            m.text ||
            m.message?.conversation ||
            m.message?.extendedTextMessage?.text ||
            "";

        const args = text.trim().split(/\s+/).slice(1);

        if (args.length < 2) {
            return m.reply(
`❌ Usage:
.rch <CHANNEL_LINK> <EMOJI1>|<EMOJI2>

Example:
.rch https://whatsapp.com/channel/xxxx 🔥|😍|😂`
            );
        }

        const channelLink = args[0];
        const emojis = args.slice(1).join(" ").split("|").map(e => e.trim()).filter(Boolean);

        let success = 0;
        let failed = 0;

        for (const emoji of emojis) {
            const url =
`https://react.whyux-xec.my.id/api/rch?link=${encodeURIComponent(channelLink)}&emoji=${encodeURIComponent(emoji)}`;

            try {
                const res = await fetch(url, {
                    headers: { "x-api-key": BOT_API_KEY }
                });

                const data = await res.json().catch(() => null);

                if (data?.success) success++;
                else failed++;

                await new Promise(r => setTimeout(r, 700));
            } catch {
                failed++;
            }
        }

        return m.reply(
`🤖 *MULTI REACT DONE*
━━━━━━━━━━━━━━
🔗 Channel: ${channelLink}
😀 Emojis: ${emojis.join(" ")}
✅ Success: ${success}
❌ Failed: ${failed}`
        );

    } catch (e) {
        console.error(e);
        return m.reply("⚠️ Command crashed");
    }
});
