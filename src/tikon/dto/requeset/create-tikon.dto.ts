import { IsEnum, IsNotEmpty, Matches, Max, MAX, Min } from "class-validator";
import { TikonCategory } from "../tikon-category.enum";
import { Transform } from "class-transformer";

export class CreateTikonDto {
  @IsNotEmpty({ message: "가맹점명을 추가해주세요" })
  storeName: string;

  @IsNotEmpty({ message: "티콘에 이름을 추가해주세요" })
  tikonName: string;

  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(TikonCategory, { message: "카테고리에 맞는 값을 입력해주세요" })
  @IsNotEmpty({ message: "카테고리를 추가해주세요" })
  category: TikonCategory;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: "만료일은 yyyy-MM-dd 형식이어야 합니다.",
  })
  @IsNotEmpty({ message: "만료일을 추가해주세요" })
  finishedTikon: string;

  @Transform(({ value }) => Number(value))
  @Min(10, { message: "할인율은 10% 미만으로 설정할 수 없어요." })
  @Max(100, { message: "할인율은 100% 이상으로 설정할 수 없어요." })
  @IsNotEmpty({ message: "할인율을 추가해주세요" })
  discount: number;
}
