import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaCard } from 'src/models/mediacard.model';
import { Permission } from 'src/models/permission.model';
import { User } from 'src/models/user.model';

console.log(__dirname);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'onyxya.sqlite',
      entities: [User, Permission, MediaCard],
      migrations: [__dirname + '/migrations/*.ts'],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}
