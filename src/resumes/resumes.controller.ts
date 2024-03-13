import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto, createUserCvDTO } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @Post()
  @ResponseMessage("Create a resume")
  async create(@Body() createUserCvDTO: createUserCvDTO, @User() user: IUser) {
    const newResume = await this.resumesService.create(createUserCvDTO, user);
    return {
      _id: newResume._id,
      createdAt: newResume.createdAt
    };
  }

  @Post('by-user')
  @ResponseMessage("Fetch resume by user")
  findOneByUser(@User() user: IUser) {
    return this.resumesService.findOneByUser(user);
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch resumes with pagination")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage("Fetch resume by id")
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Update resume status")
  update(@Param('id') id: string, @Body('status') status: string, @User() user: IUser) {
    return this.resumesService.update(id, status, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a resume")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
