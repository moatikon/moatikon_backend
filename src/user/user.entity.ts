import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  userid: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
