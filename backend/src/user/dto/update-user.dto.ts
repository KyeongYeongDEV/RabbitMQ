import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";


export class UpdateUserDto { // Update는 모든 필드가 선택 사항이다
  @IsEmail({}, { message : '이메일 형식이 아닙니다' })
  @IsOptional()
  email : string;

  @IsString()
  @MinLength(2, { message : '이름은 최소 2자리 이상이여야 합니다.' })

  @IsOptional()
  name : string;
}

