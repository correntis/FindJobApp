// app.module.ts
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import config from ".//../config/database.config";
import { UsersModule } from "./modules/users.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth.module";
import { CompaniesModule } from "./modules/companies.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(config().mongoUri),
    AuthModule,
    UsersModule,
    CompaniesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
