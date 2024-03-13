import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
import { Role, RoleDocument } from 'src/roles/schemas/role.schema';
import { USER_ROLE } from 'src/databases/sample';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name) private roleModel: SoftDeleteModel<RoleDocument>
  ) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10)
    const hash = hashSync(password, salt)
    return hash
  }

  async register(registerUserDto: RegisterUserDto) {
    const isExist = await this.userModel.findOne({ email: registerUserDto.email })
    if (isExist)
      throw new BadRequestException(`Email: ${registerUserDto.email} da ton tai tren he thong. Vui long su dung email khac`)
    const userRole = await this.roleModel.findOne({ name: USER_ROLE })
    const hashPassword = this.getHashPassword(registerUserDto.password)
    return this.userModel.create({
      ...registerUserDto,
      password: hashPassword,
      role: userRole?._id
    });
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const isExist = await this.userModel.findOne({ email: createUserDto.email })
    if (isExist)
      throw new BadRequestException(`Email: ${createUserDto.email} da ton tai tren he thong. Vui long su dung email khac`)
    const hashPassword = this.getHashPassword(createUserDto.password)
    return this.userModel.create({
      ...createUserDto,
      password: hashPassword,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    });
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);

    delete filter.current
    delete filter.pageSize

    let offset = (+currentPage - 1) * (+limit);
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .select('-password')
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
      throw new BadRequestException(`not found user with id = ${id}`)
    return this.userModel.findOne({
      _id: id
    }).select('-password')
      .populate({ path: 'role', select: { name: 1 } });
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({ email: username })
      .populate({ path: 'role', select: { name: 1 } })
  }

  findOneByToken(refreshToken: string) {
    return this.userModel.findOne({ refreshToken })
      .populate({ path: 'role', select: { name: 1 } })
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  update(updateUserDto: UpdateUserDto, user: IUser) {
    return this.userModel.updateOne(
      { _id: updateUserDto._id },
      {
        ...updateUserDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id))
      throw new BadRequestException(`not found user with id = ${id}`)

    const foundUser = await this.userModel.findById(id)
    if (foundUser?.email === 'admin@gmail.com')
      throw new BadRequestException(`Khong the xoa tai khoan admin@gmail.com!!`)

    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
    return this.userModel.softDelete({
      _id: id
    });
  }

  updateUserToken = (refreshToken: string, _id: string) => {
    return this.userModel.updateOne(
      { _id },
      { refreshToken }
    );
  }
}
