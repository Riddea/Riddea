import { Context, Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { Callback } from "../constants";
import { waifyPicsApi } from "../helpers/waifyPicsApi";

export default class extends CommandInterface {
  constructor() {
    super({
      description: "Send waifu pictures",
      collectUsage: true,
      name: "waifu",
      actionsName: ["WaifyPics Service"],
      actions: ["NEW_WAIFY_WAIFYPICS"],
    });
  }

  async run(ctx: Context) {
    const CBData = ctx.callbackQuery ? (ctx.callbackQuery as Callback).data : undefined;
    const keyboard = Markup.inlineKeyboard(
      this.actions.map((x, i) => Markup.button.callback(this.actionsName[i], x)),
      { columns: 1 },
    );

    if (!CBData || CBData == "NEW_WAIFY_WAIFYPICS") {
      const images = await waifyPicsApi({ endPoint: "sfw/waifu", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    await ctx.reply("Do you like to see more waifu images?", keyboard);
  }
}
