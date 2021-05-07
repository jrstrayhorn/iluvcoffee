import { IsString } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly brand: string;

  // each value contains an array of string
  @IsString({ each: true })
  readonly flavors: string[];
}
