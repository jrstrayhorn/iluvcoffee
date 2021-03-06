import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { CoffeeRatingModule } from './coffee-rating/coffee-rating.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import appConfig from './config/app.config';
import { APP_PIPE } from '@nestjs/core';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    // this breaks b/c typeOrmModule is loading BEFORE process.env values
    // order of imports should not matter at all.. how to fix use async
    TypeOrmModule.forRootAsync({
      // can inject configService if we want
      // async factory is loaded AFTER the rest of core modules are loaded
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities: true, // load modules automatically w/o entities arries
        synchronize: true,
        // typeOrm will be synced each time, disable in production -
        // auto generate table with any class with @Entity decorator
        // this is for dev only
      }),
    }),
    // looks for .env file in root directory by default
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DATABASE_HOST: Joi.required(),
        DATABASE_PORT: Joi.number().default(3306),
      }),
      load: [appConfig],
      // envFilePath: '.environment', // can set custom env file path
      // ignoreEnvFile: true // may want to do this for production since going to read from hosting variables instead of env file
    }), // will read process env files and environment variables
    CoffeesModule,

    CoffeeRatingModule,
    DatabaseModule,
    CommonModule,
  ],
  controllers: [AppController],
  // a provider can inject dependencies
  // objects create relationships with each other
  // NEST handles DI for us
  providers: [AppService],
})
export class AppModule {}
