import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { Public, ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) { }

  @Post()
  @ResponseMessage("Create a subscriber")
  async create(@Body() createSubscriberDto: CreateSubscriberDto, @User() user: IUser) {
    const newSubscriber = await this.subscribersService.create(createSubscriberDto, user);
    return {
      _id: newSubscriber._id,
      createdAt: newSubscriber.createdAt
    };
  }

  @Post('skills')
  @ResponseMessage("Create subscriber's skills")
  @SkipCheckPermission()
  async getUserSkills(@User() user: IUser) {
    return this.subscribersService.getSkills(user)
  }

  @Get()
  @Public()
  @ResponseMessage("Fetch subscribers with pagination")
  findAll(
    @Query("current") currentPage: string,
    @Query("pageSize") limit: string,
    @Query() qs: string,
  ) {
    return this.subscribersService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage("Fetch subscriber by id")
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @Patch('')
  @SkipCheckPermission()
  @ResponseMessage("Update a subscriber")
  update(@Body() updateSubscriberDto: UpdateSubscriberDto, @User() user: IUser) {
    return this.subscribersService.update(updateSubscriberDto, user);
  }

  @Delete(':id')
  @ResponseMessage("Delete a subscriber")
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.subscribersService.remove(id, user);
  }
}
