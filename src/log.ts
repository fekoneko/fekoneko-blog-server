import { existsSync } from 'fs';
import { mkdir, appendFile } from 'fs/promises';
import { format } from 'date-fns';
import path from 'path';

const LOGS_DIR = path.join(__dirname, '..', 'logs');

const log = async (message: string) => {
  console.log(`[log] ${message}`);
  try {
    if (!existsSync(LOGS_DIR)) await mkdir(LOGS_DIR);
    await appendFile(
      path.join(LOGS_DIR, 'log.txt'),
      `${format(new Date(), 'dd.MM.yyyy\tHH:mm:ss')}\t${message}\n`
    );
  } catch (err) {
    console.log(`Unable to log to file!: ${(err as Error).message}\n${(err as Error).stack}`);
  }
};

export default log;
