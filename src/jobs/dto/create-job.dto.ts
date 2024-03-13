import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator";
import mongoose from "mongoose";

class Company {
    @IsNotEmpty()
    @IsMongoId()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    logo: string
}

export class CreateJobDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    skills: string[];

    @IsNotEmpty()
    location: string;

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    @IsNotEmpty()
    company: Company;

    @IsNotEmpty()
    salary: number;

    @IsNotEmpty()
    quantity: number;

    @IsNotEmpty()
    level: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    startDate: Date;

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    endDate: Date;

    @IsNotEmpty()
    isActive: boolean
}
