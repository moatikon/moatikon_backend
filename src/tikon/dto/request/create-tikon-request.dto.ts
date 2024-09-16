import { IsEnum, IsNotEmpty, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { TikonCategory } from '../../enum/tikon-category.enum';

export class CreateTikonRequestDto {
  @IsNotEmpty({ message: '가맹점의 이름을 설정해주세요.' })
  storeName: string;

  @IsNotEmpty({ message: '티콘의 이름을 설정해주세요.' })
  tikonName: string;

  @IsNotEmpty({ message: '카테고리를 설정해주세요.' })
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(TikonCategory, {message: "카테고리에 맞게끔 값을 설정해 주세요."})
  category: TikonCategory;

  @IsNotEmpty({ message: '날짜를 설정해주세요.' })
  @Matches(/^\d{4}-([0][1-9]|[1][0-2])-([0][1-9]|[1-2][0-9]|[3][0-1])$/, {
    message: '날짜는 yyyy-MM-dd 형식이어야 합니다.',
  })
  finishedTikon: string;

  @IsNotEmpty({ message: '할인율을 설정해주세요.' })
  discount: number;

  @IsNotEmpty({ message: 'diviceToken은 비어있으면 안됩니다.'})
  deviceToken: string
}
