import { IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

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
    
    @IsDate()
    @IsNotEmpty()
    dateOfBirth: Date;

    @IsString()
    @IsOptional()
    profilePicture: string;


}
