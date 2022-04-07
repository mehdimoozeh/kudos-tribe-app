class TribeWebhookActorDto {
  id: ID;
  roleId: ID;
  roleType: string;
}

class TribeWebhookObjectDto {
  id: ID;
}

class TribeWebhooksTargetDto {
  networkId: ID;
}

class TribeWebhooksDataDto {
  time: Date;
  name: 'space.created' | 'member.created';
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
  context: string; // The context of the action
  entityId: ID; // The ID of the context
  currentSettings: unknown;
  type: 'SUBSCRIPTION'; // The type of webhook request
  data: TribeWebhooksDataDto;
}
