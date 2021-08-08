import { Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { waifuPicsApi } from "../helpers/waifuPicsApi";
import { ContextCallbackWithData } from "../typings/telegraf";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Send waifu pictures",
      collectUsage: true,
      cooldown: true,
      name: "waifu",
      actions: [
        {
          name: "WaifuPics Service",
          callback: "NEW_WAIFU_WAIFUPICS",
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

    if (!CBData || CBData == "NEW_WAIFU_WAIFUPICS") {
      const images = await waifuPicsApi({ endPoint: "sfw/waifu", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    await ctx.reply(ctx.i18n.translate("newPackWaifu"), keyboard);
  }
}