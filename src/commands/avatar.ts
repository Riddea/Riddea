import { Context } from "telegraf";
import { bot } from "../app";
import axios from "axios";
import { createConnection, getConnection } from "typeorm";
import { Settings } from "../entities/Settings";
import { fileTypes } from "../constants";

export default async function avatarCMD(message: Context) {
    const output = await (
        await axios.get("https://shiro.gg/api/images/avatars")
    ).data;

    if (!fileTypes.includes(output.fileType)) return;

    await bot.telegram.sendPhoto(message.message.chat.id, output.url, {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "Show new avatar image",
                        callback_data: "NEW_AVATAR",
                    },
                ],
            ],
        },
    });

    if (getConnection().isConnected) return;

    const connection = await createConnection();
    const dbRepo = connection.getRepository(Settings);
    const dbRepoUpdate = await dbRepo.findOne(1);
    dbRepoUpdate.avatarUsed = dbRepoUpdate.avatarUsed + 1;
    await dbRepo.save(dbRepoUpdate);
    await connection.close();

    return;
}
