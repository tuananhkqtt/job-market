import { IsArray, IsEmail, IsMongoId, IsNotEmpty, IsObject, } from "class-validator";
import mongoose from "mongoose";

export class CreateResumeDto {

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsMongoId()
    userId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    url: string;

    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    @IsMongoId()
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    jobId: mongoose.Schema.Types.ObjectId;
}
export class createUserCvDTO {

    @IsNotEmpty()
    url: string;

    @IsNotEmpty()
    @IsMongoId()
    companyId: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    @IsMongoId()
    jobId: mongoose.Schema.Types.ObjectId;
}