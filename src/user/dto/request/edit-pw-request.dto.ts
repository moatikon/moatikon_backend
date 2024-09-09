import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class EditPwRequestDto {
  @IsEmail({}, { message: '이메일의 형식으로 입력해주세요' })
  email: string;

  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,20}$/, {
    message:
      '비밀번호는 4~20글자에 문자, 숫자, 특수문자가 다 포함되어야 합니다.',
  })
  password: string;

  @IsNotEmpty({ message: '인증코드의 값은 비어있을 수 없어요.' })
  successCode: string;
}
