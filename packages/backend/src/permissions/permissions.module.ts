import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { Permission } from 'src/models/permission.model';
import { User } from 'src/models/user.model';
import { Role } from 'src/models/role.model';

@Module({
  imports: [TypeOrmModule.forFeature([Permission, User, Role])],
  controllers: [PermissionsController],
  providers: [PermissionsService, AuthGuard],
})
export class PermissionsModule {}
