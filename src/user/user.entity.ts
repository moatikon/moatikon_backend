import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('user')
@Unique(['email'])
export class UserEntity {
  @PrimaryGeneratedColumn()
  userid: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
