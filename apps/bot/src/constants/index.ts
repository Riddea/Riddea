import { RateLimiter } from "@riddea/telegraf-rate-limiter";

export const fileTypes = ["png", "jpg", "jpeg"];
export const ignoreEndpoints = ["nsfw/blowjob"];
export const partners = [
  {
    name: "Хентай библиотека",
    url: "https://vk.com/libraryhentai",
  },
  {
    name: "Не смотри, бака! (anime arts)",
    url: "https://vk.com/moushiwake",
  },
];

export const cmdLimiter = new RateLimiter(1, 5000);
