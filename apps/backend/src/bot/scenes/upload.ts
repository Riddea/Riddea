import { Context, Markup, Scenes } from "telegraf";
import { getRepository } from "typeorm";
import { Collection, Upload } from "../../entities";
import base64Data from "../helpers/base64Decoder";
import { botLogger } from "../helpers/logger";
import { File, Message } from "typegram";
import { uploadFile } from "../libs/s3";
import crypto from "crypto";

async function getKeyboard(ctx: Context) {
  try {
    const collections = await getRepository(Collection).find({
      where: { userID: ctx.from.id },
      order: { createdAt: "DESC" },
    });

    const collectionsList = collections.map((c) =>
      Markup.button.callback(`${c.isPublic ? "🔓" : "🔒"} ${c.name}`, `IMAGE_ADD_COLLECTION_${c.id}`),
    );
    collectionsList.push({ text: ctx.i18n.translate("skip"), callback_data: "IMAGE_ADD_COLLECTION_SKIP", hide: false });

    const keyboard = Markup.inlineKeyboard(collectionsList, { columns: 1 });

    return keyboard;
  } catch (err) {
    botLogger.error(`Scene upload error:`, err.stack);
  }
}

export const uploadScene = new Scenes.BaseScene<Scenes.SceneContext>("upload")
  .enter((ctx) => {
    try {
      ctx.reply(ctx.i18n.translate("sendImage"));
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  })
  .on("photo", async (ctx) => {
    try {
      await ctx.replyWithPhoto(ctx.message.photo.pop().file_id, await getKeyboard(ctx));
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  })
  .action(/IMAGE_ADD_COLLECTION_\d+/, async (ctx) => {
    try {
      await ctx.answerCbQuery();
      const message = ctx.update.callback_query.message as Message & { photo: File[] };
      const photo = message.photo.pop() as File;
      const id = Number(ctx.match.input.replace("IMAGE_ADD_COLLECTION_", ""));
      const collectionName = (await getRepository(Collection).findOne({ id })).name;

      await saveAndUploadPhoto({ collectionId: id, photo, userID: ctx.from.id });

      await ctx.reply(ctx.i18n.translate("newImageCollection", { name: collectionName }));
      await ctx.deleteMessage(ctx.message);
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  })
  .action("IMAGE_ADD_COLLECTION_SKIP", async (ctx) => {
    try {
      await ctx.answerCbQuery();

      const message = ctx.update.callback_query.message as Message & { photo: File[] };
      const photo = message.photo.pop() as File;

      const collectionsRepository = getRepository(Collection);
      const data = { userID: ctx.from.id, name: "IWC" };
      const collection = (await collectionsRepository.findOne(data)) || (await collectionsRepository.save(data));

      await saveAndUploadPhoto({ photo, userID: ctx.from.id, collectionId: collection.id });

      await ctx.reply(ctx.i18n.translate("newImageNoCollection"));
      await ctx.deleteMessage(ctx.message);
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  })
  .command("cancel", async (ctx) => {
    try {
      await ctx.scene.leave();
      await ctx.reply(ctx.i18n.translate("leaveScene"));
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  })
  .on("message", async (ctx) => {
    try {
      await ctx.reply(ctx.i18n.translate("newImageLeave"));
    } catch (err) {
      botLogger.error(`Scene upload error:`, err.stack);
    }
  });

const saveAndUploadPhoto = async ({ collectionId, userID, photo }: { collectionId?: number; userID: number; photo: File }) => {
  const base64 = await base64Data(photo);
  const fileName = crypto.randomUUID();

  await uploadFile({ buffer: base64, filePath: `${userID}/${fileName}` });

  await getRepository(Upload).save({
    userID,
    fileID: photo.file_id,
    fileName,
    collection: collectionId ? { id: collectionId } : undefined,
  });
};