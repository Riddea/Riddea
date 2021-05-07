import { Context, Markup } from "telegraf";
import { bot } from "../app";
import axios from "axios";
import { createConnection } from "typeorm";
import { Settings } from "../entities/Settings";

export async function hentaiCMD(message: Context) {
    const output = await axios.get("https://shiro.gg/api/images/nsfw/hentai");
    await bot.telegram.sendPhoto(
        message.message.chat.id,
        output.data.url,
        Markup.keyboard([Markup.button.text("/hentai", false)])
            .resize()
            .oneTime()
    );

    await createConnection()
        .then(async (connection) => {
            const dbRepo = connection.getRepository(Settings);
            const dbRepoUpdate = await dbRepo.findOne(1);
            dbRepoUpdate.hentaiUsed = dbRepoUpdate.hentaiUsed + 1;
            await dbRepo.save(dbRepoUpdate);

            await connection.close();
        })
        .catch(() => {});

    return;
}