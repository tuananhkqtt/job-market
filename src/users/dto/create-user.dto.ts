import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsEmail({}, { message: "Email ko dung dinh dang" })
    @IsNotEmpty({ message: "Email ko dc de trong" })
    email: string;

    @IsNotEmpty()
    password: string;

    name: string;
    address: string;
}
