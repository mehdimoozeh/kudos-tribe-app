import { Injectable, Logger } from '@nestjs/common';
import type { TribeWebhooksBodyDto } from './dtos';
import { DatabaseService } from './database.service';

@Injectable()
export class TribeWebhookService {
  private readonly KUDOS_EMOJI_UNICODE = '\u{1F369}'; // 🍩
  private readonly logger = new Logger(TribeWebhookService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  private detectEmojis(text: string): number {
    const emojis: string[] = text.match(/(\p{Emoji})+/gu) || [];
    this.logger.verbose(emojis);
    // emojis.forEach((item) => console.log(item, item.length));
    // TODO: fix counting connected emojis like 🍩🍩, 🍩🤪
    return emojis.filter((item) => item === this.KUDOS_EMOJI_UNICODE).length;
  }

  public handleWebhookRequest(input: TribeWebhooksBodyDto) {
    if (this.databaseService.isDataIdExist(input.data.id)) {
      this.logger.log(`Duplicated webhook request ${input.data.id}`);
      return;
    }
    const countedKudos = this.detectEmojis(input.data.object.shortContent);
    const giver = input.data.object.createdById;
    const mentionedPeople = input.data.object.mentionedMembers.filter(
      (member) => member !== giver,
    );
    if (countedKudos === 0 || mentionedPeople.length === 0) return;
    this.logger.verbose({
      kudos: countedKudos,
      mentionedPeople,
    });
    this.databaseService.save(giver, mentionedPeople, countedKudos);
    this.databaseService.print();
    // console.log(input.data.object);
    // console.log(input.data.target);
    // Rest of logic
  }
}
