import { mkdirSync } from 'node:fs';
import { readdir, stat, writeFile } from 'node:fs/promises';
import { EOL } from 'node:os';
import { join, normalize, parse } from 'node:path';

export class Register {
  readonly INIT_LOG_FILE_NUMBER = 1;
  readonly _logPath = process.env.LOG_PATH;
  readonly _logErrorPath = process.env.LOG_ERROR_PATH;
  readonly _maxSize = +process.env.LOG_FILE_SIZE;

  async toLogFile(...messages: string[]) {
    await this.write([new Date().toISOString(), ...messages], this._logPath);
  }

  async toLogErrorFile(...messages: string[]) {
    await this.write(
      [new Date().toISOString(), ...messages],
      this._logErrorPath,
    );
  }

  private async write(messages: string[], folder: string) {
    const logPath = normalize(folder);
    try {
      mkdirSync(logPath, { recursive: true });

      const files = [];
      const entities = await readdir(logPath, { withFileTypes: true });
      for (const entity of entities) {
        if (entity.isFile() && /^\d+.log$/i.test(entity.name)) {
          files.push(entity.name);
        }
      }
      let fileNumber: number;
      if (files.length === 0) {
        fileNumber = this.INIT_LOG_FILE_NUMBER;
      } else {
        files.sort((item1, item2) => +parse(item2).name - +parse(item1).name);
        const fileSize = (await stat(join(logPath, files[0]))).size;
        fileNumber = +parse(files[0]).name;

        if (fileSize >= 1000 * this._maxSize) {
          fileNumber++;
        }
      }

      const logFile = join(logPath, `${fileNumber}.log`);

      await writeFile(logFile, messages.join(' ') + EOL, { flag: 'a' });
    } catch (error) {
      console.log(error.message);
    }
  }
}
