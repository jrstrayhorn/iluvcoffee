import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';

// sql table === 'coffee', can specify inside
// entity decorator like @Entity('coffees')
// to directly name a table
@Entity()
export class Coffee {
  @PrimaryGeneratedColumn() // will autoincrement as well
  id: number;

  // non-nullable by default
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  brand: string;

  @Column({ default: 0 })
  recommendations: number;

  // // stories arrays as json, and make nullable
  // @Column('json', { nullable: true })
  // flavors: string[];

  // helps decide the owner part of the relationship
  @JoinTable()
  @ManyToMany((type) => Flavor, (flavor) => flavor.coffees, {
    cascade: true, // ['insert'] - will automatically insert new flavors when coffees are added with new flavors in DB
  })
  flavors: Flavor[];
}
