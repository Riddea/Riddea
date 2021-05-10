require("dotenv").config();
import "source-map-support";
import "reflect-metadata";
import { Telegraf } from "telegraf";
import callbackEvent from "./events/callback";
import readyEvent from "./events/ready";
import avatarCMD from "./commands/avatar";
import bondageCMD from "./commands/bondage";
import helpCMD from "./commands/help";
import hentaiCMD from "./commands/hentai";
import nekoCMD from "./commands/neko";
import startCMD from "./commands/start";
import statusCMD from "./commands/status";
import thighsCMD from "./commands/thighs";
import trapCMD from "./commands/trap";
import uploadCMD from "./commands/upload";
import wallpaperCMD from "./commands/wallpaper";

export const bot = new Telegraf(process.env.TOKEN);
export let startData = Date.now();

bot.on("callback_query", callbackEvent);
bot.command("avatar", avatarCMD);
bot.command("bondage", bondageCMD);
bot.command("help", helpCMD);
bot.command("hentai", hentaiCMD);
bot.command("neko", nekoCMD);
bot.command("start", startCMD);
bot.command("status", statusCMD);
bot.command("thighs", thighsCMD);
bot.command("trap", trapCMD);
bot.command("upload", uploadCMD);
bot.command("wallpaper", wallpaperCMD);
bot.launch().then(() => readyEvent());

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
process.on("unhandledRejection", (reason) => console.log(reason));
process.on("uncaughtException", (reason) => console.log(reason));
