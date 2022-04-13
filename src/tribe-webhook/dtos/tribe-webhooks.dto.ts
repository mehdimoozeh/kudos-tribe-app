import {
  IsArray,
  IsDate,
  IsDefined,
  IsIn,
  IsObject,
  IsString,
} from 'class-validator';
import { WebhookEventName } from '../constants';

class TribeWebhookObjectDto {
  @IsString()
  id: ID;
  // Unused information!
  @IsString()
  networkId: ID;
  @IsString()
  spaceId: ID;
}

export class TribeWebhookPostObjectDto extends TribeWebhookObjectDto {
  @IsString()
  createdById: ID;

  @IsString()
  shortContent: HTML;

  @IsArray()
  @IsString({})
  mentionedMembers: string[];
}

export class TribeWebhookMemberObjectDto extends TribeWebhookObjectDto {
  @IsString()
  name: string;
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

export class TribeWebhooksDataDto {
  @IsDate()
  time: Date;

  @IsString()
  @IsIn(Object.values(WebhookEventName))
  name: WebhookEventName;

  @IsObject()
  object: TribeWebhookPostObjectDto | TribeWebhookMemberObjectDto; // The main object involved in the action

  // Unused information!
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
