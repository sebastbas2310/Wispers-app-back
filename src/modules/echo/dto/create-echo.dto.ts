import { IsArray, IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateEchoDto {
  @IsString()
  @IsNotEmpty()
  ID: string;

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
}
