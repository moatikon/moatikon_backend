import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("user")
export class UserEntity {
  @PrimaryColumn()
  email: string;

  @Column()
  password: string;
}
