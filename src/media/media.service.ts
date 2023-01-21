import { Injectable } from '@nestjs/common';
import { IMediaInterface } from './media.interface';
import { path } from 'app-root-path';
import { ensureDir, writeFile } from 'fs-extra';

@Injectable()
export class MediaService {
  async saveMedia(
    mediaFile: Express.Multer.File,
    folder = 'default',
  ): Promise<IMediaInterface> {
    const uploadFolder = `${path}/uploads/${folder}`;
    await ensureDir(uploadFolder);

    await writeFile(
      `${uploadFolder}/${mediaFile.originalname}`,
      mediaFile.buffer,
    );
    return {
      url: `/uploads/${folder}/${mediaFile.originalname}`,
      name: mediaFile.originalname,
    };
  }
}