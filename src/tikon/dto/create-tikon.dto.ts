import { IsNotEmpty } from "class-validator";
import { TikonCategory } from "./tikon-category.enum";

export class CreateTikonDto {
  @IsNotEmpty({ message: "가맹점명을 추가해주세요" })
  storeName: string;

  @IsNotEmpty({ message: "티콘에 이름을 추가해주세요" })
  tikonName: string;

  @IsNotEmpty({ message: "카테고리를 추가해주세요" })
  category: TikonCategory;

  @IsNotEmpty({ message: "만료일을 추가해주세요" })
  finishedTikon: string;

  @IsNotEmpty({ message: "할인율을 추가해주세요" })
  discount: number;
}
