import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesController } from './coffees/coffees.controller';
import { CoffeesService } from './coffees/coffees.service';

@Module({
  imports: [],
  controllers: [AppController, CoffeesController],
  // a provider can inject dependencies
  // objects create relationships with each other
  // NEST handles DI for us
  providers: [AppService, CoffeesService],
})
export class AppModule {}
