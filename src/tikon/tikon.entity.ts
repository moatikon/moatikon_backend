import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { TikonCategory } from "./dto/tikon-category.enum";

@Entity({ name: "tikon" })
export class TikonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  image: string;

  @Column()
  storeName: string;

  @Column()
  tikonName: string;

  @Column()
  category: TikonCategory;

  @Column()
  finishedTikon: string;

  @Column()
  discount: number;
}
