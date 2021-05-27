import { Scenes } from "telegraf";
import { getRepository } from "typeorm";
import { Collection } from "../entities/Collection";

export const newCollection = new Scenes.BaseScene<Scenes.SceneContext>("createCollection")
    .enter((ctx) => ctx.reply("Enter the name of new collection"))
    .on("text", async (ctx) => {
        const repository = getRepository(Collection);
        const isExists = await repository.findOne({
            userID: ctx.from.id,
            name: ctx.message.text,
        });

        if (isExists) {
            return ctx.reply(`Collection with name ${isExists.name} already exists. Please, enter another name.`).catch(() => {});
        }

        await repository.save({
            name: ctx.message.text,
            userID: ctx.from.id,
            isPublic: false,
        });
        (ctx.scene.session as any).collectionName = ctx.message.text;

        ctx.scene.leave().catch(() => {});
    })
    .leave((ctx) => {
        ctx.reply(`Collection with name ${(ctx.scene.session as any).collectionName} created`).catch((err: any) =>
            console.log("[ERROR]: ", err)
        );
    });
