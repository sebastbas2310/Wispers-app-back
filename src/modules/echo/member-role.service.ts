import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { MemberRole, MemberRoleDocument } from './entities/member-role.entity';

@Injectable()
export class MemberRoleService {
  constructor(
    @InjectModel(MemberRole.name) private memberRoleModel: Model<MemberRoleDocument>,
  ) {}

  async create(echoId: string, userId: string, roleId: string): Promise<MemberRole> {
    if (!Types.ObjectId.isValid(echoId) || !Types.ObjectId.isValid(roleId)) {
      throw new BadRequestException('Invalid echoId or roleId');
    }

    // Check if member already has a role in this echo
    const existingRole = await this.memberRoleModel.findOne({
      echoId: new Types.ObjectId(echoId),
      userId,
    }).exec();

    if (existingRole) {
      // Update existing role
      const updated = await this.memberRoleModel
        .findByIdAndUpdate(
          existingRole._id,
          { roleId: new Types.ObjectId(roleId), assignedAt: new Date() },
          { new: true },
        )
        .exec();
      
      if (!updated) {
        throw new BadRequestException('Failed to update member role');
      }
      
      return updated;
    }

    const memberRole = new this.memberRoleModel({
      echoId: new Types.ObjectId(echoId),
      userId,
      roleId: new Types.ObjectId(roleId),
    });

    return memberRole.save();
  }

  async findByEchoAndUser(echoId: string, userId: string): Promise<MemberRole> {
    if (!Types.ObjectId.isValid(echoId)) {
      throw new BadRequestException('Invalid echoId');
    }

    const memberRole = await this.memberRoleModel
      .findOne({
        echoId: new Types.ObjectId(echoId),
        userId,
      })
      .populate('roleId')
      .exec();

    if (!memberRole) {
      throw new NotFoundException(`Member role not found for user ${userId} in echo ${echoId}`);
    }

    return memberRole;
  }

  async findByEcho(echoId: string): Promise<MemberRole[]> {
    if (!Types.ObjectId.isValid(echoId)) {
      throw new BadRequestException('Invalid echoId');
    }

    return this.memberRoleModel
      .find({ echoId: new Types.ObjectId(echoId) })
      .populate('roleId')
      .exec();
  }

  async findByUser(userId: string): Promise<MemberRole[]> {
    return this.memberRoleModel
      .find({ userId })
      .populate('roleId')
      .populate('echoId')
      .exec();
  }

  async remove(echoId: string, userId: string): Promise<void> {
    if (!Types.ObjectId.isValid(echoId)) {
      throw new BadRequestException('Invalid echoId');
    }

    const result = await this.memberRoleModel.deleteOne({
      echoId: new Types.ObjectId(echoId),
      userId,
    }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Member role not found for user ${userId} in echo ${echoId}`);
    }
  }
}
