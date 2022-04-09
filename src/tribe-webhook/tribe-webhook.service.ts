import { Injectable, Logger } from '@nestjs/common';
import type { TribeWebhooksBodyDto } from './dtos';

@Injectable()
export class TribeWebhookService {
  private webhookIds = new Set<ID>();

  private readonly logger = new Logger(TribeWebhookService.name);

  private saveDataId(dataId: ID): void {
    this.webhookIds.add(dataId);
    this.logger.log(`Saved! data.id: ${dataId}`);
  }

  private isDataIdExist(dataId: ID): boolean {
    const result = this.webhookIds.has(dataId);
    if (!result) this.saveDataId(dataId);
    return result;
  }

  public handleWebhookRequest(input: TribeWebhooksBodyDto) {
    if (this.isDataIdExist(input.data.id)) {
      this.logger.log(`Duplicated webhook request ${input.data.id}`);
      return;
    }
    // Rest of logic
  }
}
