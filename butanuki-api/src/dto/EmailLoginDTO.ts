import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class EmailLoginDTO {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  captchaToken: string;

  @ApiProperty()
  locale?: string;
}

export class EmailLoginVerifyDTO {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  tempCode: string;

  @ApiProperty()
  mfaCode?: string;
}
