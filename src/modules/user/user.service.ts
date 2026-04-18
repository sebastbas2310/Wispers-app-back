import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userModel.findOne({ email: createUserDto.email });

    if (existUser) {
      throw new BadRequestException('User with this email already exists');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const userToCreate = { ...createUserDto, password: hashedPassword };

    const createdUser = new this.userModel(userToCreate);
    return createdUser.save();
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existUser = await this.userModel.findById(id);

    if (!existUser) {
      throw new NotFoundException('User not found');
    }

    // if email is changing, make sure it's not taken
    if (updateUserDto.email && updateUserDto.email !== existUser.email) {
      const emailExists = await this.userModel.findOne({
        email: updateUserDto.email,
        _id: { $ne: id },
      });

      if (emailExists) {
        throw new BadRequestException('Email already in use by another account');
      }
    }

    // prepare update payload, hashing password if provided
    const payload: any = { ...updateUserDto };
    if (updateUserDto.password) {
      payload.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userModel.updateOne({ _id: id }, payload);

    return this.userModel.findById(id);
  }

  async changeStatus(id: string, status: string) {
    const existUser = await this.userModel.findById(id);
  
    if (!existUser) {
      throw new NotFoundException('User not found');
    }

    return this.userModel.updateOne({ _id: id }, { status });
  } 

  async remove(id: string): Promise<any> {
    const existUser = await this.userModel.findById(id);

    if (!existUser) {
      throw new NotFoundException('User not found');
    }
    return this.userModel.deleteOne({ _id: id });
  }
}
