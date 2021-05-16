import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

// for complex scenarios where you want index on mutiple columns
@Index(['name', 'type'])
@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  // setup index for single column
  @Index()
  @Column()
  name: string;

  // generate column
  @Column('json')
  payload: Record<string, any>;
}
