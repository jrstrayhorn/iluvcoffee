import { Controller, Get } from '@nestjs/common';

// 'coffees' ties route /coffees to this controller
// still need HTTP verb method
@Controller('coffees')
export class CoffeesController {
  @Get('flavors')
  findAll() {
    return 'this action returns all coffees';
  }
}
