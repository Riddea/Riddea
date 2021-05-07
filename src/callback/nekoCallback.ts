import axios from "axios";
import { bot, fileType } from "../app";

export async function nekoCallback(callback: any) {
    const output = await (await axios.get("https://shiro.gg/api/images/neko"))
        .data;

    if (!fileType.includes(output.fileType)) return;

    await bot.telegram.sendPhoto(
        callback.update.callback_query.message.chat.id,
        output,
        {
            reply_markup: {
                inline_keyboard: [
                    [
                        {
                            text: "Show new neko image",
                            callback_data: "NEW_NEKO",
                        },
                    ],
                ],
            },
        }
    );
}