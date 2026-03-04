import { IsString, IsNotEmpty, IsArray, IsOptional, IsNumber } from 'class-validator';

export class CreateVotacionDto {
  @IsString()
  @IsNotEmpty()
  pregunta: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  opciones: string[];

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  votos?: number[];

  @IsString()
  @IsOptional()
  EchoID?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsNotEmpty()
  authorId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  likes?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  comments?: string[];
} 
