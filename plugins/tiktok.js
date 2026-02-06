const axios = require("axios");
const { cmd } = require("../command");

cmd(
  {
    pattern: "tiktok",
    alias: ["tt"],
    react: "🎬",
    desc: "Download TikTok videos (Unlimited replies)",
    category: "download",
    filename: __filename,
  },

  async (conn, mek, m, { from, q, reply }) => {
    try {
      if (!q || !q.startsWith("http")) {
        return reply("❌ Valid TikTok URL ekak denna.");
      }

      // ⏳ react
      await conn.sendMessage(from, {
        react: { text: "⏳", key: mek.key },
      });

      const { data } = await axios.get(
        `https://api-aswin-sparky.koyeb.app/api/downloader/tiktok?url=${encodeURIComponent(
          q
        )}`
      );

      if (!data?.status) {
        return reply("⚠️ TikTok data ganna ba.");
      }

      const dat = data.data;

      const caption = `
📺 *TIKTOK DOWNLOADER*

📑 *Title:* ${dat.title || "N/A"}
👀 *Views:* ${dat.view || "0"}

🔽 *Reply with number (Unlimited):*

1️⃣ HD Video 🔋
2️⃣ SD Video 📱
3️⃣ Audio MP3 🎵

> © RANUMITHA-X-MD 🌛`;

      const sentMsg = await conn.sendMessage(
        from,
        { image: { url: dat.thumbnail }, caption },
        { quoted: mek }
      );

      const menuMsgId = sentMsg.key.id;

      // 🔁 UNLIMITED reply listener
      conn.ev.on("messages.upsert", async (update) => {
        try {
          const msg = update.messages[0];
          if (!msg?.message) return;

          const text =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text;

          const repliedId =
            msg.message.extendedTextMessage?.contextInfo?.stanzaId;

          // ❗ Only replies to this menu
          if (repliedId !== menuMsgId) return;

          const choice = text?.trim();
          if (!["1", "2", "3"].includes(choice)) return;

          // ⬇️ react
          await conn.sendMessage(from, {
            react: { text: "⬇️", key: msg.key },
          });

          let sendType;

          if (choice === "1") {
            sendType = {
              video: { url: dat.video },
              caption: "📥 HD Video",
            };
          }

          if (choice === "2") {
            sendType = {
              video: { url: dat.sd_video || dat.video },
              caption: "📥 SD Video",
            };
          }

          if (choice === "3") {
            sendType = {
              audio: { url: dat.audio },
              mimetype: "audio/mpeg",
              ptt: false,
            };
          }

          // ⬆️ react
          await conn.sendMessage(from, {
            react: { text: "⬆️", key: msg.key },
          });

          await conn.sendMessage(from, sendType, { quoted: msg });

          // ✔️ react
          await conn.sendMessage(from, {
            react: { text: "✔️", key: msg.key },
          });
        } catch (e) {
          console.error("Unlimited reply error:", e);
        }
      });
    } catch (err) {
      console.error("TikTok cmd error:", err);
      reply("❌ Error occurred.");
    }
  }
);
