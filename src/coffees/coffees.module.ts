import { Injectable, Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/events/entities/event.entity';
import { Connection } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

class MockCoffeesService {}

class ConfigService {}
class DevelopmentConfigService {}
class ProductionConfigService {}

@Injectable()
export class CoffeeBrandsFactory {
  create() {
    /* ... do something ... */
    return ['buddy brew', 'nescafe'];
  }
}

@Module({
  // registers TypeOrmModule in child feature
  // pass in array of entities
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])],
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    // {
    //   provide: CoffeesService,
    //   useValue: new MockCoffeesService(),
    // },
    CoffeeBrandsFactory,
    {
      provide: ConfigService,
      useClass:
        process.env.NODE_ENV === 'development'
          ? DevelopmentConfigService
          : ProductionConfigService,
    },
    {
      provide: COFFEE_BRANDS,
      useValue: ['buddy brew', 'nescafe'],
      scope: Scope.TRANSIENT,
    },
    // {
    //   provide: COFFEE_BRANDS,
    //   useFactory: (brandsFactory: CoffeeBrandsFactory) =>
    //     brandsFactory.create(),
    //   inject: [CoffeeBrandsFactory], // passed into useFactory function
    // },
    // {
    //   provide: COFFEE_BRANDS,
    //   useFactory: async (connection: Connection): Promise<string[]> => {
    //     // const coffeeBrands = await connection.query('SELECT * ...');
    //     const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe']);
    //     console.log('[!] Async factory');
    //     return coffeeBrands;
    //   },
    //   inject: [Connection],
    // },
  ],
  exports: [CoffeesService],
})
export class CoffeesModule {}
