import { IsEmail, IsNotEmpty } from 'class-validator';

export class CodeCheckRequestDto {
  @IsEmail({}, { message: '이메일의 형식으로 입력해주세요' })
  email: string;

  @IsNotEmpty({ message: '인증코드의 값은 비어있을 수 없어요.' })
  code: string;
}
