import { TikonEntity } from 'src/tikon/tikon.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('user')
@Unique(['email'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  userid: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany((type) => TikonEntity, (tikon) => tikon.user)
  tikons: TikonEntity[];
}
