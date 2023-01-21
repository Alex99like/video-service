import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import path from 'app-root-path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `http://localhost:4200/uploads`,
      serveRoot: '/uploads',
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}