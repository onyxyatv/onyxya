import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './db/database.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { MediaModule } from './media/media.module';
import { MediaCardModule } from './mediacart/mediacard.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    MediaCardModule,
    PermissionsModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('');
  }
}
