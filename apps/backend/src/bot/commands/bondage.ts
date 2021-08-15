import { Markup } from "telegraf";

import { shiroApi } from "../helpers/shiroApi";
import { ContextCallbackWithData } from "../typings/telegraf";
import { CommandInterface } from "./_interface";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "[NSFW]: Send bondage images",
      collectUsage: true,
      cooldown: true,
      name: "bondage",
      actions: [
        {
          name: "Shiro Service",
          callback: "NEW_BONDAGE_SHIRO",
        },
      ],
    });
  }

  async run(ctx: ContextCallbackWithData) {
    const CBData = ctx.callbackQuery?.data;
    const keyboard = Markup.inlineKeyboard(
      this.actions.map((action) => Markup.button.callback(action.name, action.callback)),
      { columns: 1 },
    );

    if (!CBData || CBData == "NEW_BONDAGE_SHIRO") {
      const images = await shiroApi({ endPoint: "nsfw/bondage", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    await ctx.reply(ctx.i18n.translate("bot.main.newPack.bondage", { pack: ctx.i18n.translate("bot.packs.bondage") }), keyboard);
  }
}
