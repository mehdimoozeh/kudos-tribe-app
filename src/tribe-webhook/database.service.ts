import { Injectable, Logger } from '@nestjs/common';
import { KudosModel } from './kudos.model';

@Injectable()
export class DatabaseService {
  private webhookIds = new Set<ID>();
  private list: { [key: ID]: KudosModel } = {};
  private readonly logger = new Logger(DatabaseService.name);

  private isMemberExist(member: ID): boolean {
    return !!this.list[member];
  }

  public saveDataId(dataId: ID): void {
    this.webhookIds.add(dataId);
    this.logger.log(`Saved! data.id: ${dataId}`);
  }

  public isDataIdExist(dataId: ID): boolean {
    const result = this.webhookIds.has(dataId);
    if (!result) this.saveDataId(dataId);
    return result;
  }

  public addNewMember(member: ID, name: string): boolean {
    this.isMemberExist(member);
    this.list[member] = new KudosModel(member, name);
    return true;
  }

  public save(giver: ID, receivers: ID[], numberOfKudos: number): boolean {
    const validMembers = receivers.filter((member) =>
      this.isMemberExist(member),
    );
    this.list[giver].give(validMembers, numberOfKudos);
    validMembers.forEach((receiver) =>
      this.list[receiver].receive(giver, numberOfKudos),
    );
    return true;
  }

  public print() {
    this.logger.verbose(JSON.stringify(this.list, null, 2));
  }
}
