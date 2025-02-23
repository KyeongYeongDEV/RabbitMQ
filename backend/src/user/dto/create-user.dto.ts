import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsEmail({}, { message : '이메일 형식이 아닙니다' })
  @IsNotEmpty({ message : '이메일은 필수 입력 항목입니다.' })
  email : string;

  @IsString()
  @MinLength(2, { message : '이름은 최소 2자리 이상이여야 합니다.' })
  @IsNotEmpty({ message : '이름은 필수 항목입니다.' })
  name : string;
}