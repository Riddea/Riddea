import { Context, Markup } from "telegraf";
import { CommandInterface } from "./_interface";
import { shiroApi } from "../helpers/shiroApi";
import { Callback } from "../constants";

export default class extends CommandInterface {
  constructor() {
    super({
      name: "thighs",
      description: "[NSFW]: Send thighs image",
      collectUsage: true,
      actionsName: ["Shiro Service"],
      actions: ["NEW_THIGHS_SHIRO"],
    });
  }

  async run(ctx: Context) {
    const CBData = ctx.callbackQuery ? (ctx.callbackQuery as Callback).data : undefined;
    const keyboard = Markup.inlineKeyboard(
      this.actions.map((x, i) => Markup.button.callback(this.actionsName[i], x)),
      { columns: 1 },
    );

    if (!CBData || CBData == "NEW_THIGHS_SHIRO") {
      const images = await shiroApi({ endPoint: "nsfw/thighs", amount: 10 });

      await ctx.replyWithMediaGroup(
        images.map((image) => {
          return {
            type: "photo",
            media: image,
          };
        }),
      );
    }

    await ctx.reply("Do you like to see more thighs images?", keyboard);
  }
}
