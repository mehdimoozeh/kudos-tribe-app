import { Injectable, Logger } from '@nestjs/common';
import { TribeClient } from '@tribeplatform/gql-client';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../tribe-webhook/database.service';
import { SpaceRoleType } from '@tribeplatform/gql-client/types';

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
    this.initialKudosApp();
  }

  private async addMembers(): Promise<ID[]> {
    const members = await this.tribeClient.members.list({ limit: 10 });
    const membersId = [];
    members.edges.map((edge) => {
      this.databaseService.addNewMember(edge.node.id, edge.node.name);
      membersId.push(edge.node.id);
    });
    return membersId;
  }

  private async createKudosReportSpace(members: ID[]) {
    const spaces = await this.tribeClient.spaces.list({ limit: 10 }, 'basic');
    const isKudosSpaceExist = spaces.edges.some(
      (space) =>
        space.node.name === 'Kudos' && space.node.imageId === ':doughnut:',
    );
    if (isKudosSpaceExist) {
      this.logger.verbose(`Space already created.`);
      return;
    }
    this.tribeClient.spaces
      .create({
        input: {
          name: 'Kudos',
          imageId: ':doughnut:',
          memberIds: members.filter(
            (member) => member !== this.configService.get('TRIBE_MY_ADMIN_ID'),
          ),
          whoCanPost: [SpaceRoleType.ADMIN],
          whoCanReply: [SpaceRoleType.ADMIN],
          whoCanReact: [SpaceRoleType.MEMBER],
        },
      })
      .then((result) => {
        this.logger.verbose(`Space Created: ${result.id}`);
      })
      .catch((error) => {
        this.logger.error(error);
      });
  }

  private async initialKudosApp(): Promise<void> {
    this.tribeAccessToken = await this.tribeClient.generateToken({
      networkId: this.configService.get('TRIBE_NETWORK_ID'),
      memberId: this.configService.get('TRIBE_MY_ADMIN_ID'),
    });
    this.tribeClient.setToken(this.tribeAccessToken);

    const membersId = await this.addMembers();
    this.databaseService.print();

    this.createKudosReportSpace(membersId);
  }
}
