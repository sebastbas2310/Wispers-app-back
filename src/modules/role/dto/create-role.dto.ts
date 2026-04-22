import { IsString, IsArray, IsNotEmpty } from 'class-validator';

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
}