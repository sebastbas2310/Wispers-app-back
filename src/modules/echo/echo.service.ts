import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEchoDto } from './dto/create-echo.dto';
import { UpdateEchoDto } from './dto/update-echo.dto';
import { Echo, EchoDocument } from './entities/echo.entity';
import { MemberRoleService } from './member-role.service';
import { RoleService } from '../role/role.service';

@Injectable()
export class EchoService {
  constructor(
    @InjectModel(Echo.name) private echoModel: Model<EchoDocument>,
    private memberRoleService: MemberRoleService,
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
    });

    const savedEcho = await created.save();

    // Assign creator role to the creator
    if (creator) {
      await this.assignCreatorRole(savedEcho._id.toString(), creator);
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

  private async assignCreatorRole(echoId: string, userId: string): Promise<void> {
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
          color: '#FF0000', // Red color for creator role
          permissions: allPermissions,
        });
      }

      // Assign creator role to the user
      const roleDoc = creatorRole as any;
      const roleId = roleDoc._id?.toString() || roleDoc.id;
      await this.memberRoleService.create(echoId, userId, roleId);
    } catch (error) {
      console.error(`Error assigning creator role: ${error.message}`);
      // Don't throw error if role assignment fails, echo creation should still succeed
    }
  }
}
