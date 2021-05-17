import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

class MockCoffeesService {}

@Module({
  // registers TypeOrmModule in child feature
  // pass in array of entities
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [
    //CoffeesService
    {
      provide: CoffeesService,
      useValue: new MockCoffeesService(),
    },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
