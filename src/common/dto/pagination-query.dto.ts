import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  // @Type(() => Number) // make sure parsed as a number
  limit: number;

  @IsOptional()
  @IsPositive()
  // @Type(() => Number) // don't need due to global transform option in main.ts
  offset: number;
}
