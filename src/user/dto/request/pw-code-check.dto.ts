import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class PwCodeCheckDto {
  @IsEmail({}, { message: "이메일 형식이 아닙니다." })
  email: string;

  @IsNotEmpty()
  code: number;
  
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,20}$/, {
    message:"비밀번호는 4~20글자에 문자, 숫자, 특수문자가 다 포함되어야 합니다.",
  })
  password: string;
}
