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

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    MediaCardModule,
    PermissionsModule,
    MediaModule,
    MediaPathModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
