import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';

@Module({
  imports: [CoffeesModule],
  controllers: [AppController],
  // a provider can inject dependencies
  // objects create relationships with each other
  // NEST handles DI for us
  providers: [AppService],
})
export class AppModule {}
