class TribeWebHooksDataDto {
  challenge: string;
}

export class TribeWebHooksBodyDto {
  networkId: string;
  context: string;
  currentSettings: string[];
  type: string;
  data: TribeWebHooksDataDto;
}

export class TribeWebHooksResponseDto {
  type: string;
  status: string;
  data: TribeWebHooksDataDto;
}
