import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from './database.service';
import type {
  TribeWebhookMemberObjectDto,
  TribeWebhookPostObjectDto,
} from './dtos';
import { TribeApiService } from './tribe-api.service';

@Injectable()
export class TribeWebhookService {
  private readonly KUDOS_EMOJI_UNICODE = '\u{1F369}'; // 🍩
  private readonly logger = new Logger(TribeWebhookService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly tribeApiService: TribeApiService,
  ) {}

  private detectEmojis(text: string): number {
    const emojis: string[] = text.match(/(\p{Emoji})+/gu) || [];
    this.logger.verbose(emojis);
    // emojis.forEach((item) => console.log(item, item.length));
    // TODO: fix counting connected emojis like 🍩🍩, 🍩🤪
    return emojis.filter((item) => item === this.KUDOS_EMOJI_UNICODE).length;
  }

  public checkNewPost(dataId: ID, object: TribeWebhookPostObjectDto): void {
    if (this.databaseService.isDataIdExist(dataId)) {
      this.logger.log(`Duplicated webhook request ${dataId}`);
      return;
    }
    const countedKudos = this.detectEmojis(object.shortContent);
    const giver = object.createdById;
    const mentionedPeople = object.mentionedMembers.filter(
      (member) => member !== giver,
    );
    if (countedKudos === 0 || mentionedPeople.length === 0) return;
    this.logger.verbose({
      kudos: countedKudos,
      mentionedPeople,
    });
    this.databaseService.save(giver, mentionedPeople, countedKudos);
    this.databaseService.print();
  }

  public newMember(object: TribeWebhookMemberObjectDto): void {
    this.databaseService.addNewMember(object.id, object.name);
    this.tribeApiService.updateLeaderBoardPost();
  }
}
