import { Type } from "class-transformer";
import { IsDate, IsISO8601, IsNotEmpty, IsOptional, IsString, IsArray } from "class-validator";

export class CreateUserDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    status: string = 'active';
    
    @Type(() => Date)
    @IsDate()
    @IsNotEmpty()
    dateOfBirth: Date;

    @IsString()
    @IsOptional()
    profilePicture: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    echos: string[];
}
