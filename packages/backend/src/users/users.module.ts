import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsService } from 'src/permissions/permissions.service';
import { Permission } from 'src/models/permission.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, Permission])],
  controllers: [UserController],
  providers: [UserService, AuthGuard, PermissionsService],
})
export class UsersModule {}
