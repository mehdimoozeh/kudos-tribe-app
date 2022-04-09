import { Injectable, Logger } from '@nestjs/common';
import type { TribeWebhooksBodyDto } from './dtos';

@Injectable()
export class TribeWebhookService {
  private readonly KUDOS_EMOJI_UNICODE = '\u{1F369}'; // 🍩
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

  private detectEmojis(text: string): number {
    const emojis: string[] = text.match(/(\p{Emoji})+/gu) || [];
    this.logger.verbose(emojis);
    emojis.forEach((item) => console.log(item, item.length));
    // TODO: fix counting connected emojis like 🍩🍩, 🍩🤪
    return emojis.filter((item) => item === this.KUDOS_EMOJI_UNICODE).length;
  }

  public handleWebhookRequest(input: TribeWebhooksBodyDto) {
    if (this.isDataIdExist(input.data.id)) {
      this.logger.log(`Duplicated webhook request ${input.data.id}`);
      return;
    }
    const kudos = this.detectEmojis(input.data.object.shortContent);
    const mentionedPeople = input.data.object.mentionedMembers;
    this.logger.verbose({
      kudos,
      mentionedPeople,
    });
    // console.log(input.data.object);
    // console.log(input.data.target);
    // Rest of logic
  }
}
