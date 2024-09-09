import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TikonCategory } from './enum/tikon-category.enum';
import { UserEntity } from 'src/user/user.entity';

@Entity('tikon')
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

  @ManyToOne((type) => UserEntity, (user) => user.tikons, { eager: false })
  user: UserEntity;
}
