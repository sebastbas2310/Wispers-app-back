import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreateMensajeDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsDateString()
  @IsOptional()
  timestamp?: string;
} 
