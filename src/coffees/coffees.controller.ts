import { Controller, Get, Param } from '@nestjs/common';

// 'coffees' ties route /coffees to this controller
// still need HTTP verb method
@Controller('coffees')
export class CoffeesController {
  @Get('flavors')
  findAll() {
    return 'this action returns all coffees';
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // just @Param() params gives us all items in request parameters
    // so we'd need to do params.id to get value
    // give value in @Param() to get specific parameter
    return `This action returns ${id} coffee`;
  }
}
