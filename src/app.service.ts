import { Injectable, Logger } from '@nestjs/common';
import { TribeClient } from '@tribeplatform/gql-client';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from './tribe-webhook/database.service';

@Injectable()
export class AppService {
  private tribeClient: TribeClient;
  private tribeAccessToken: string;
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {
    this.tribeClient = new TribeClient({
      clientId: this.configService.get('TRIBE_CLIENT_ID'),
      clientSecret: this.configService.get('TRIBE_CLIENT_SECRET'),
      graphqlUrl: this.configService.get('TRIBE_GRAPHQL_URL'),
    });
    this.setTribeAccessToken();
  }

  private async setTribeAccessToken(): Promise<void> {
    this.tribeAccessToken = await this.tribeClient.generateToken({
      networkId: this.configService.get('TRIBE_NETWORK_ID'),
    });
    this.tribeClient.setToken(this.tribeAccessToken);
    this.tribeClient.members.list({ limit: 10 }).then((members) => {
      this.logger.verbose(members);
      this.databaseService.addNewMember('123');
      this.databaseService.print();
    });
  }
}
