import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class CreateMemberRoleDto {
  @IsMongoId()
  @IsNotEmpty()
  echoId: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsMongoId()
  @IsNotEmpty()
  roleId: string;
}
