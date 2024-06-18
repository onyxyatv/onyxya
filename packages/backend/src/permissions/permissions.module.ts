import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { Permission } from 'src/models/permission.model';
import { User } from 'src/models/user.model';
import { Role } from 'src/models/role.model';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';
import { UserService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, User, Role])],
  controllers: [PermissionsController],
  providers: [PermissionsService, AuthGuard, PermissionsGuard, UserService],
})
export class PermissionsModule {}
