import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './db/database.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { MediaModule } from './media/media.module';
import { MediaPathModule } from './media-path/media-path.module';
import { MediaCardModule } from './mediacard/mediacard.module';
import { PermissionsModule } from './permissions/permissions.module';
import { PLaylistsModule } from './playlists/playlists.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    DatabaseModule,
    PermissionsModule,
    UsersModule,
    MediaCardModule,
    MediaModule,
    MediaPathModule,
    PLaylistsModule,
    // To serve HLS files for media streaming
    ServeStaticModule.forRoot({
      rootPath: join('/home/node/media/output'),
      serveRoot: '/media_hls/',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
