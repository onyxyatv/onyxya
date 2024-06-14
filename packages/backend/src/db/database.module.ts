import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaCard } from 'src/models/mediacard.model';
import { Permission } from 'src/models/permission.model';
import { User } from 'src/models/user.model';
import { syncDbStatus } from '../config.json';
import { CreatePermissions20240614130000 } from './migrations/createPermissions.migration';
import { CreateRolesPermissions20240614131535 } from './migrations/createRolesPermissions';
import { CreateRoles20240614120000 } from './migrations/createRoles.migration';
import { Role } from 'src/models/role.model';
import { Media } from '../models/media.model';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'onyxya.sqlite',
      entities: [User, Role, Permission, Media, MediaCard],
      migrations: [
        CreateRoles20240614120000,
        CreatePermissions20240614130000,
        CreateRolesPermissions20240614131535,
      ],
      synchronize: syncDbStatus,
      migrationsRun: true,
    }),
  ],
})
export class DatabaseModule {}
