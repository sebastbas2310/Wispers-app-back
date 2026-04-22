import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsBoolean()
  @IsOptional()
  anonymous?: boolean;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  likes?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  comments?: string[];

  @IsString()
  @IsOptional()
  echoID?: string;
}