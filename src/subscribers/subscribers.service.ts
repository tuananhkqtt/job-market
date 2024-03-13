import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class SubscribersService {

  constructor(@InjectModel(Subscriber.name) private subscriberModel: SoftDeleteModel<SubscriberDocument>) { }

  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const isExist = await this.subscriberModel.findOne({ email: createSubscriberDto.email })
    if (isExist)
      throw new BadRequestException(`Email: ${createSubscriberDto.email} da ton tai tren he thong. Vui long su dung email khac`)
    return this.subscriberModel.create({
      ...createSubscriberDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  getSkills = (user: IUser) => {
    return this.subscriberModel.findOne({ email: user.email }, { skills: 1 })
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);

    delete filter.current
    delete filter.pageSize

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.subscriberModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.subscriberModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    }
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`not found subscriber with id = ${id}`)
    return this.subscriberModel.findOne({
      _id: id
    })
  }

  update(updateSubscriberDto: UpdateSubscriberDto, user: IUser) {
    return this.subscriberModel.updateOne(
      { email: user.email },
      {
        ...updateSubscriberDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      },
      { upsert: true }
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`not found subscriber with id = ${id}`)
    await this.subscriberModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return this.subscriberModel.softDelete({
      _id: id
    });
  }
}
