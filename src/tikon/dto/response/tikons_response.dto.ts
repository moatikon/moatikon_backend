import { TikonEntity } from 'src/tikon/tikon.entity';

export class TikonsResponseDto {
  tikons: TikonEntity[];

  constructor(tikons: TikonEntity[]) {
    this.tikons = tikons;
  }
}
