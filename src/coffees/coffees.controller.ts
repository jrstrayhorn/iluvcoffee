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
  SetMetadata,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Protocol } from 'src/common/decorators/protocol.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

// 'coffees' ties route /coffees to this controller
// still need HTTP verb method
@ApiTags('coffees')
@Controller('coffees')
//@UsePipes(new ValidationPipe()) // can pass in config object now, use class tho
export class CoffeesController {
  // declare and init coffessService and keep scope to class only w/ private
  // readonly so we won't be able to change it
  constructor(private readonly coffeesService: CoffeesService) {}

  //@UsePipes(ValidationPipe)
  // @SetMetadata('isPublic', true) // should use custom decorator!!
  //@ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @Public()
  @Get()
  async findAll(
    @Protocol('https') protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    console.log(protocol);
    // findAll(@Res() response) {
    // using the underlining response object from express or fastify
    // provides great flexibility to mess with headers etc
    // but in practice use with care b/c lose compat with nest features
    // like interceptors.. our code becomes platform depending
    // code is also harder to test
    // best practice use nest standard approach
    // response.status(200).send('this action returns all coffees');
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    const { limit, offset } = paginationQuery;
    return this.coffeesService.findAll(paginationQuery);
    // return `This action returns all coffees. Limit: ${limit}, offset: ${offset}`;
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(id);
    // validation pipe will try to convert the string to number with transform is true
    // just @Param() params gives us all items in request parameters
    // so we'd need to do params.id to get value
    // give value in @Param() to get specific parameter
    // return `This action returns ${id} coffee`;
    // console.log(typeof id);
    return this.coffeesService.findOne('' + id);
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

    // without validation pipe - dto is the shape of the type
    // but not an instance of the type
    // console.log(createCoffeeDto instanceof CreateCoffeeDto);
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
