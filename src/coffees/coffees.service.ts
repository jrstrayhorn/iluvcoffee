import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { Connection, Repository } from 'typeorm';
import { COFFEE_BRANDS } from './coffees.constants';
import coffeesConfig from './config/coffees.config';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

// how to change scope
//@Injectable({ scope: Scope.TRANSIENT })
@Injectable()
export class CoffeesService {
  // private coffees: Coffee[] = [
  //   {
  //     id: 1,
  //     name: 'Shipwreck Roast',
  //     brand: 'Buddy Brew',
  //     flavors: ['chocolate', 'vanilla'],
  //   },
  // ];

  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly connection: Connection, // @Inject(COFFEE_BRANDS) coffeeBrands: string[],
  ) // @Inject(coffeesConfig.KEY)
  // private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
  {
    // instead of private readonly configService: ConfigService,
    // console.log(coffeeBrands);
    // console.log('CoffeeService instantiated');
    // see type <string>, real value is string
    // regardless of type, get will always return a string
    // every env variable is a string by default
    // will need to do type conversation ourselves
    // with 2nd param it will return that as a default if null
    // example of directly accessing the process.env variable
    // const databaseHost = this.configService.get<string>(
    //   'DATABASE_HOST',
    //   'localhost',
    // );
    // using dot notation is a path to traverse the custom object from appConfig
    //const databaseHost = this.configService.get('database.host', 'localhost');
    // will get the entire coffees config object
    // there is a better way tho!
    // const coffeesConfig = this.configService.get('coffees.foo');
    // console.log(coffeesConfig);
    // automatic infers the type giving us type safety and intellisense
    // console.log(coffeesConfiguration.foo);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    // return this.coffees;
    const { limit, offset } = paginationQuery;
    return this.coffeeRepository.find({
      relations: ['flavors'],
      skip: offset,
      take: limit,
    });
  }

  async findOne(id: string) {
    // throw 'A random error'; // automatic internal server error
    // const coffee = this.coffees.find((item) => item.id === +id);
    const coffee = await this.coffeeRepository.findOne(id, {
      relations: ['flavors'],
    });
    if (!coffee) {
      //throw new HttpException(`Coffee ${id} not found`, HttpStatus.NOT_FOUND);
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    //this.coffees.push(createCoffeeDto);
    // waits until all promises are done
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    // creates coffee class instance based on Partial
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    // returns a promise
    return this.coffeeRepository.save(coffee);
  }

  async update(id: string, updateCoffeDto: UpdateCoffeeDto) {
    // const existingCoffee = this.findOne(id);
    // if (existingCoffee) {
    //   // update the existing entity
    // }

    // flavors is optional so need to check before preloading
    const flavors =
      updateCoffeDto.flavors &&
      (await Promise.all(
        updateCoffeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));
    // creates a new eneity based on entity pass to it
    // if obj exists in db, returns all parts of that object
    // then replaces props with values passed in to it
    // will return undefined if id isn't found in the db
    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...updateCoffeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async remove(id: string) {
    // const coffeeIndex = this.coffees.findIndex((item) => item.id === +id);
    // if (coffeeIndex >= 0) {
    //   this.coffees.splice(coffeeIndex, 1);
    // }
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  async recommendCoffe(coffee: Coffee) {
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      coffee.recommendations++;

      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const existingFlavor = await this.flavorRepository.findOne({ name });
    if (existingFlavor) {
      return existingFlavor;
    }
    return this.flavorRepository.create({ name });
  }
}
