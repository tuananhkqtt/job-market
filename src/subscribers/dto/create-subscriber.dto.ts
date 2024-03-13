import { IsArray, IsEmail, IsNotEmpty, IsString, } from "class-validator";

export class CreateSubscriberDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    skills: string[];
}
