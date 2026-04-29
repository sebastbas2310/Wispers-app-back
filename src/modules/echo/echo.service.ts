import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateEchoDto } from './dto/create-echo.dto';
import { UpdateEchoDto } from './dto/update-echo.dto';
import { Echo, EchoDocument } from './entities/echo.entity';
import { RoleService } from '../role/role.service';

@Injectable()
export class EchoService {
  constructor(
    @InjectModel(Echo.name) private echoModel: Model<EchoDocument>,
    private roleService: RoleService,
  ) {}

  async create(createEchoDto: CreateEchoDto): Promise<Echo> {
    if (createEchoDto.privacy === 'private' && !createEchoDto.password) {
      throw new BadRequestException('Password required for private echo');
    }

    const creator = createEchoDto.echoCreator;
    const echoMembers = Array.from(
      new Set([...(createEchoDto.echoMembers ?? []), ...(creator ? [creator] : [])]),
    );

    const created = new this.echoModel({
      ...createEchoDto,
      echoMembers,
      echoMessages: createEchoDto.echoMessages ?? [],
      echoTags: createEchoDto.echoTags ?? [],
      memberRoles: [],
    });

    const savedEcho = await created.save();

    // Assign creator role to the creator
    if (creator) {
      return await this.assignCreatorRole(savedEcho._id.toString(), creator);
    }

    return savedEcho;
  }

  async addMember(echoId: string, userId: string, password?: string): Promise<Echo> {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new BadRequestException('Valid user ID is required to join echo');
    }

    const echo = await this.echoModel.findById(echoId).select('privacy password').exec();
    if (!echo) {
      throw new NotFoundException(`Echo with _id ${echoId} not found`);
    }

    if (echo.privacy === 'private') {
      if (!password) {
        throw new BadRequestException('Password required to join private echo');
      }
      if (echo.password !== password) {
        throw new BadRequestException('Invalid password');
      }
    }

    const updated = await this.echoModel
      .findByIdAndUpdate(
        echoId,
        { $addToSet: { echoMembers: userId } },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(`Echo with _id ${echoId} not found`);
    }

    return updated;
  }

  async addMessage(echoId: string, message: string): Promise<Echo> {
    const updated = await this.echoModel
      .findByIdAndUpdate(
        echoId,
        { $push: { echoMessages: message } },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(`Echo with _id ${echoId} not found`);
    }

    return updated;
  }

  async addTag(echoId: string, tag: string): Promise<Echo> {
    const updated = await this.echoModel
      .findByIdAndUpdate(
        echoId,
        { $addToSet: { echoTags: tag } },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(`Echo with _id ${echoId} not found`);
    }

    return updated;
  }

  async findAll(): Promise<Echo[]> {
    return this.echoModel.find().exec();
  }

  async findOne(id: string): Promise<Echo> {
    const echo = await this.echoModel.findById(id).exec();
    if (!echo) {
      throw new NotFoundException(`Echo with _id ${id} not found`);
    }
    return echo;
  }

  async findOneWithPasswordValidation(id: string, password?: string): Promise<Echo> {
    const echo = await this.echoModel.findById(id).exec();
    if (!echo) {
      throw new NotFoundException(`Echo with _id ${id} not found`);
    }

    // If echo is private, validate password
    if (echo.privacy === 'private') {
      if (!password) {
        throw new BadRequestException('Password required to access this private echo');
      }
      if (echo.password !== password) {
        throw new BadRequestException('Incorrect password');
      }
    }

    return echo;
  }

  async findByCreator(creatorId: string): Promise<Echo[]> {
    return this.echoModel.find({ echoCreator: creatorId }).exec();
  }

  async update(id: string, updateEchoDto: UpdateEchoDto): Promise<Echo> {
    if (updateEchoDto.privacy === 'private' && !updateEchoDto.password) {
      throw new BadRequestException('Password required for private echo');
    }

    const updated = await this.echoModel
      .findByIdAndUpdate(id, updateEchoDto, { new: true })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Echo with _id ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const deleted = await this.echoModel.findByIdAndDelete(id).exec();
    return { deleted: Boolean(deleted) };
  }

  async getMemberRole(echoId: string, userId: string): Promise<any> {
    if (!Types.ObjectId.isValid(echoId)) {
      throw new BadRequestException('Invalid echoId');
    }

    const echo = await this.echoModel.findById(echoId).exec();
    if (!echo) {
      throw new NotFoundException(`Echo with _id ${echoId} not found`);
    }

    const memberRole = echo.memberRoles?.find((mr) => mr.userId === userId);
    if (!memberRole) {
      throw new NotFoundException(`Member role not found for user ${userId} in echo ${echoId}`);
    }

    return memberRole;
  }

  async getCreatorRole(echoId: string): Promise<{ userId: string; roleId: string; isCreator: boolean }> {
    if (!Types.ObjectId.isValid(echoId)) {
      throw new BadRequestException('Invalid echoId');
    }

    const echo = await this.echoModel.findById(echoId).exec();
    if (!echo) {
      throw new NotFoundException(`Echo with _id ${echoId} not found`);
    }

    // Find creator role
    let creatorUserId = null;
    let creatorRoleId = null;

    for (const memberRole of echo.memberRoles || []) {
      const role = await this.roleService.findOne(memberRole.roleId.toString());
      if (role && role.name === 'creator') {
        creatorUserId = memberRole.userId;
        creatorRoleId = memberRole.roleId.toString();
        break;
      }
    }

    if (!creatorUserId) {
      throw new NotFoundException(`Creator role not found for echo ${echoId}`);
    }

    return {
      userId: creatorUserId,
      roleId: creatorRoleId,
      isCreator: true,
    };
  }

  async assignMemberRole(echoId: string, userId: string, roleId: string): Promise<Echo> {
    if (!Types.ObjectId.isValid(echoId) || !Types.ObjectId.isValid(roleId)) {
      throw new BadRequestException('Invalid echoId or roleId');
    }

    // Verify the role exists and get its details
    const role = await this.roleService.findOne(roleId);
    if (!role) {
      throw new NotFoundException(`Role with _id ${roleId} not found`);
    }

    // CRITICAL: Prevent assigning 'creator' role to anyone
    if (role.name === 'creator') {
      throw new BadRequestException('Cannot manually assign creator role. It is assigned automatically to the echo owner.');
    }

    // Get the echo to check current roles
    const echo = await this.echoModel.findById(echoId).exec();
    if (!echo) {
      throw new NotFoundException(`Echo with _id ${echoId} not found`);
    }

    // Remove existing role first
    const updated = await this.echoModel
      .findByIdAndUpdate(
        echoId,
        {
          $pull: { memberRoles: { userId } },
        },
        { new: false },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(`Echo with _id ${echoId} not found`);
    }

    // Now add the new role
    const finalEcho = await this.echoModel
      .findByIdAndUpdate(
        echoId,
        {
          $addToSet: {
            memberRoles: {
              userId,
              roleId: new Types.ObjectId(roleId),
              assignedAt: new Date(),
            },
          },
        },
        { new: true },
      )
      .exec();

    if (!finalEcho) {
      throw new NotFoundException(`Echo with _id ${echoId} not found`);
    }

    return finalEcho;
  }

  async removeMemberRole(echoId: string, userId: string): Promise<Echo> {
    if (!Types.ObjectId.isValid(echoId)) {
      throw new BadRequestException('Invalid echoId');
    }

    // Fetch the echo to check the user's current role
    const echo = await this.echoModel.findById(echoId).exec();
    if (!echo) {
      throw new NotFoundException(`Echo with _id ${echoId} not found`);
    }

    // Find the member role for this user
    const memberRole = echo.memberRoles?.find((mr) => mr.userId === userId);
    if (!memberRole) {
      throw new NotFoundException(`Member role not found for user ${userId}`);
    }

    // Get the role details to check if it's 'creator'
    const role = await this.roleService.findOne(memberRole.roleId.toString());
    if (role && role.name === 'creator') {
      throw new BadRequestException('Cannot remove creator role from the owner of this echo');
    }

    const updated = await this.echoModel
      .findByIdAndUpdate(
        echoId,
        {
          $pull: { memberRoles: { userId } },
        },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(`Echo with _id ${echoId} not found`);
    }

    return updated;
  }

  async getMemberRoles(echoId: string): Promise<any[]> {
    if (!Types.ObjectId.isValid(echoId)) {
      throw new BadRequestException('Invalid echoId');
    }

    const echo = await this.echoModel.findById(echoId).exec();
    if (!echo) {
      throw new NotFoundException(`Echo with _id ${echoId} not found`);
    }

    return echo.memberRoles || [];
  }

  private async assignCreatorRole(echoId: string, userId: string): Promise<Echo> {
    try {
      // Find or create creator role with all permissions
      let creatorRole = await this.roleService.findOneByName('creator');

      if (!creatorRole) {
        // Create creator role with all default permissions
        const allPermissions = [
          'read',
          'write',
          'delete',
          'manage_members',
          'manage_roles',
          'manage_settings',
          'create_posts',
          'delete_posts',
          'manage_comments',
          'moderate',
        ];

        creatorRole = await this.roleService.create({
          name: 'creator',
          color: '#FF0000',
          permissions: allPermissions,
        });
      }

      // Assign creator role to the user in the echo's memberRoles array
      const roleDoc = creatorRole as any;
      const roleId = new Types.ObjectId(roleDoc._id?.toString() || roleDoc.id);

      const updatedEcho = await this.echoModel
        .findByIdAndUpdate(
          echoId,
          {
            $addToSet: {
              memberRoles: {
                userId,
                roleId,
                assignedAt: new Date(),
              },
            },
          },
          { new: true },
        )
        .exec();

      if (!updatedEcho) {
        throw new NotFoundException(`Echo with _id ${echoId} not found`);
      }

      return updatedEcho;
    } catch (error) {
      console.error(`Error assigning creator role: ${error.message}`);
      // Return the echo without role assignment if it fails
      const echo = await this.echoModel.findById(echoId).exec();
      if (!echo) {
        throw new NotFoundException(`Echo with _id ${echoId} not found`);
      }
      return echo;
    }
  }
}
