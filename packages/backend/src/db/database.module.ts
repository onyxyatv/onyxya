import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/models/user.model";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'onyxya.sqlite',
      entities: [User],
      synchronize: true
    }),
  ],
})

export class DatabaseModule {}