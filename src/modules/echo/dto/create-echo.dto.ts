import { IsArray, IsDate, IsIn, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';

export class CreateEchoDto {
  @IsString()
  @IsOptional()
  ID?: string;

  @IsString()
  @IsNotEmpty()
  echoName: string;

  @IsString()
  @IsOptional()
  echoDesc: string;

  @IsDate()
  @IsOptional()
  echoCreatedTime: Date;

  @IsArray()
  @IsOptional()
  echoMembers: string[];

  @IsArray()
  @IsOptional()
  echoMessages: string[];

  @IsString()
  @IsOptional()
  echoCreator: string;

  @IsArray()
  @IsOptional()
  echoTags: string[];

  @IsString()
  @IsOptional()
  echoImage: string;

  // nuevo: tipo de membresía, privacidad, contraseña condicional y tipo de echo
  /*@IsString()
  @IsNotEmpty()
  membershipType: string;
*/
  @IsString()
  @IsIn(['public', 'private'])
  privacy: string;

  @ValidateIf(o => o.privacy === 'private')
  @IsString()
  @IsNotEmpty()
  password?: string;

 /* @IsString()
  @IsNotEmpty()
  echoType: string;*/
}
