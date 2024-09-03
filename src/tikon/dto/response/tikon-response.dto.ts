import { TikonEntity } from "../../tikon.entity";

export class TikonResponseDto {
  tikons: TikonEntity[];

  constructor(tikons: TikonEntity[]) {
    this.tikons = tikons;
  }
}
