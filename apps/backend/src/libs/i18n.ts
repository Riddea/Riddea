import gl from "glob";
import { promisify } from "util";
import { get, set, template } from "lodash";
import fs from "fs";
import { backendLogger } from "../helpers/logger";
import { resolve } from "path";
const glob = promisify(gl);

export class I18n {
  translations: Record<string, any> = {};
  private lang = "en";

  constructor(lang?: string, translations?: Record<string, any>) {
    if (lang) this.lang = lang;
    if (translations) this.translations = translations;
  }

  public async init() {
    const cwdPath = resolve(process.cwd(), "..", "..");
    const files = await glob("locales/**", { cwd: cwdPath });
    for (const f of files.filter((f) => f.endsWith(".json"))) {
      const withoutLocales = f.replace("locales/", "").replace(".json", "");

      try {
        const filePath = resolve(cwdPath, f);
        const content = JSON.parse(fs.readFileSync(filePath, "utf8"));

        set(this.translations, withoutLocales.split("/").join("."), content);
      } catch (e) {
        backendLogger.error("Incorrect JSON file: " + f);
        backendLogger.error(e.stack);
      }
    }
    return true;
  }

  clone(lang: string) {
    return new I18n(lang, this.translations);
  }

  translate(path: string, data?: Record<string, any>) {
    const defaultTranslation = get(this.translations, `${this.lang}.${path}`, "Translate not found! Please, contact with @LWJerri!");
    const str = get(this.translations, `${this.lang}.${path}`, defaultTranslation);
    const result = template(str, { interpolate: /{{([\s\S]+?)}}/g });
    return result(data);
  }
}

export const i18n = new I18n();
export default i18n;
