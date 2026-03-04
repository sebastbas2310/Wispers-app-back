import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  date: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attendees?: string[];

  @IsNumber()
  @IsNotEmpty()
  hour: number;

  @IsNumber()
  @IsOptional()
  maxAttendees?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  @IsOptional()
  echoID?: string;

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
