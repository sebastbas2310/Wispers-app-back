import { IsArray, IsOptional, IsString, ArrayNotEmpty } from 'class-validator';

export class CreateChatDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  participants: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  messages?: string[];
} 
