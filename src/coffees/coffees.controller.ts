import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

// 'coffees' ties route /coffees to this controller
// still need HTTP verb method
@Controller('coffees')
export class CoffeesController {
  // declare and init coffessService and keep scope to class only w/ private
  // readonly so we won't be able to change it
  constructor(private readonly coffeesService: CoffeesService) {}
  @Get()
  findAll(@Query() paginationQuery) {
    // findAll(@Res() response) {
    // using the underlining response object from express or fastify
    // provides great flexibility to mess with headers etc
    // but in practice use with care b/c lose compat with nest features
    // like interceptors.. our code becomes platform depending
    // code is also harder to test
    // best practice use nest standard approach
    // response.status(200).send('this action returns all coffees');
    const { limit, offset } = paginationQuery;
    return this.coffeesService.findAll();
    // return `This action returns all coffees. Limit: ${limit}, offset: ${offset}`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // just @Param() params gives us all items in request parameters
    // so we'd need to do params.id to get value
    // give value in @Param() to get specific parameter
    // return `This action returns ${id} coffee`;
    return this.coffeesService.findOne(id);
  }

  // @Post()
  // @HttpCode(HttpStatus.GONE) // good for static status codes
  // create(@Body() body) {
  //   return body;
  // }
  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    // whiltelist: true on validation pipe
    // ensure that only the values valid for coffeDto
    // is received, used and returned
    this.coffeesService.create(createCoffeeDto);
    return createCoffeeDto;
  }

  // posting and getting specific portion of body
  // may have valuation issues so use this with caution
  // because other items in body won't get validated
  @Post('specBody')
  createSpecBody(@Body('name') name: string) {
    return name;
  }

  // put -  replaces entire resource - need whole object in request payload
  // patch - can update specific portion of object - can pass small portion of whole object in request
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    // return `this action updates ${id} coffee`;
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return `this action removes ${id} coffee`;
    return this.coffeesService.remove(id);
  }
}
