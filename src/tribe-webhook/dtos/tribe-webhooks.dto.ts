class TribeWebhookActorDto {
  id: ID;
}

class TribeWebhookObjectDto {
  id: ID;
  networkId: ID;
  spaceId: ID;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  status: 'PUBLISHED';
  createdById: ID;
  ownerId: ID;
  isAnonymous: boolean;
  shortContent: HTML;
  isReply: boolean;
  isHidden: boolean;
}

class TribeWebhooksTargetDto {
  networkId: ID;
  organizationId: ID;
  spaceId: ID;
  memberId: ID;
}

class TribeWebhooksDataDto {
  time: Date;
  name: 'post.published';
  noun: string;
  shortDescription: string;
  verb: 'CREATED';
  actor: TribeWebhookActorDto; // The member or entity that performed the action
  object: TribeWebhookObjectDto; // The main object involved in the action
  target: TribeWebhooksTargetDto; // The ID of the target and all relevant objects
  id: ID; // Unique ID for this webhook event instance
}

export class TribeWebhooksBodyDto {
  networkId: ID; // The community ID
  entityId: ID; // The ID of the context
  type: 'SUBSCRIPTION'; // The type of webhook request
  data: TribeWebhooksDataDto;
}
