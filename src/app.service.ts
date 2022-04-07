import { Injectable } from '@nestjs/common';
import { TribeClient } from '@tribeplatform/gql-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private tribeClient: TribeClient;
  private tribeAccessToken: string;

  constructor(private readonly configService: ConfigService) {
    /*this.tribeClient = new TribeClient({
      clientId: this.configService.get('TRIBE_CLIENT_ID'),
      clientSecret: this.configService.get('TRIBE_CLIENT_SECRET'),
      graphqlUrl: this.configService.get('TRIBE_GRAPHQL_URL'),
    });
    this.setTribeAccessToken();*/
  }

  private async setTribeAccessToken(): Promise<void> {
    this.tribeAccessToken = await this.tribeClient.generateToken({
      networkId: this.configService.get('TRIBE_NETWORK_ID'),
    });
    this.tribeClient.setToken(this.tribeAccessToken);
    this.tribeClient.spaces.list({ limit: 5 }, {}).then((spaces) => {
      console.log(spaces);
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
