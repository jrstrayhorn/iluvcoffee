//import { PartialType } from '@nestjs/mapped-types';

// instructs swagger that all optional properties
import { PartialType } from '@nestjs/swagger';
import { CreateCoffeeDto } from './create-coffee.dto';

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}
