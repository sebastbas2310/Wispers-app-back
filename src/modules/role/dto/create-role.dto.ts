import { IsString, IsArray, IsNotEmpty, IsMongoId, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsArray()
  @IsString({ each: true })
  permissions: string[];

  @IsMongoId()
  @IsOptional()
  echoId?: string;
}