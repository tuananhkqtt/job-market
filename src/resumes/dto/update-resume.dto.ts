import { PartialType } from '@nestjs/mapped-types';
import { CreateResumeDto } from './create-resume.dto';
import mongoose from 'mongoose';
import { IsArray, IsDate, IsEmail, IsMongoId, IsNotEmpty, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';

class UpdatedBy {

    @IsNotEmpty()
    @IsMongoId()
    _id: mongoose.Schema.Types.ObjectId;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}

class History {

    @IsNotEmpty()
    status: string;

    @IsNotEmpty()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    updatedAt: Date;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => UpdatedBy)
    updatedBy: UpdatedBy;
}

export class UpdateResumeDto extends PartialType(CreateResumeDto) {

    @IsNotEmpty()
    @IsArray()
    @ValidateNested()
    @Type(() => History)
    history: History[]
}
