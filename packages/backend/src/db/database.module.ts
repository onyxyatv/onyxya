import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaCard } from 'src/models/mediacard.model';
import { Permission } from 'src/models/permission.model';
import { User } from 'src/models/user.model';
import { syncDbStatus, migrationRunStatus } from '../../config.json';
import { Role } from 'src/models/role.model';
import { Media } from '../models/media.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'onyxya.sqlite',
      entities: [User, Role, Permission, Media, MediaCard],
      migrations: [],
      synchronize: syncDbStatus,
      migrationsRun: migrationRunStatus,
    }),
  ],
})
export class DatabaseModule {}
