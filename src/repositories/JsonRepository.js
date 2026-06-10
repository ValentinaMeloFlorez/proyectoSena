import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../../data");

export class JsonRepository {
  constructor(filename) {
    this.filePath = path.join(DATA_DIR, filename);
  }

  async _ensureDataDir() {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }

  async _readFile() {
    await this._ensureDataDir();
    try {
      const raw = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  async _writeFile(data) {
    await this._ensureDataDir();
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }
}
