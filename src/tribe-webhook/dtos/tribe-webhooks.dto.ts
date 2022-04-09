import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDefined,
  IsIn,
  IsObject,
  IsString,
} from 'class-validator';

class TribeWebhookActorDto {
  @IsString()
  id: ID;
}

class TribeWebhookObjectDto {
  @IsString()
  id: ID;

  @IsString()
  networkId: ID;

  @IsString()
  spaceId: ID;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsDate()
  publishedAt: Date;

  @IsString()
  @IsIn(['PUBLISHED'])
  status: 'PUBLISHED';

  @IsString()
  createdById: ID;

  @IsString()
  ownerId: ID;

  @IsBoolean()
  isAnonymous: boolean;

  @IsString()
  shortContent: HTML;

  @IsArray()
  @IsString({})
  mentionedMembers: string[];

  @IsBoolean()
  isReply: boolean;

  @IsBoolean()
  isHidden: boolean;
}

class TribeWebhooksTargetDto {
  @IsString()
  networkId: ID;

  @IsString()
  organizationId: ID;

  @IsString()
  spaceId: ID;

  @IsString()
  memberId: ID;
}

class TribeWebhooksDataDto {
  @IsDate()
  time: Date;

  @IsString()
  @IsIn(['post.published'])
  name: 'post.published';

  @IsString()
  noun: string;

  @IsString()
  @IsIn(['CREATED'])
  verb: 'CREATED';

  @IsObject()
  actor: TribeWebhookActorDto; // The member or entity that performed the action

  @IsObject()
  object: TribeWebhookObjectDto; // The main object involved in the action

  @IsObject()
  target: TribeWebhooksTargetDto; // The ID of the target and all relevant objects

  @IsString()
  id: ID; // Unique ID for this webhook event instance
}

export class TribeWebhooksBodyDto {
  @IsString()
  networkId: ID; // The community ID

  @IsString()
  entityId: ID; // The ID of the context

  @IsString()
  @IsIn(['SUBSCRIPTION'])
  type: 'SUBSCRIPTION'; // The type of webhook request

  @IsObject()
  data: TribeWebhooksDataDto;
}

export class TribeWebhooksHeadersDto {
  @IsDefined()
  @IsString()
  readonly 'x-tribe-signature': string;
}
