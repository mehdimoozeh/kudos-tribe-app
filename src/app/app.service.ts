import { Injectable, Logger } from '@nestjs/common';
import { TribeClient } from '@tribeplatform/gql-client';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../tribe-webhook/database.service';
import {
  PostMappingTypeEnum,
  PostTypeContext,
  SpaceRoleType,
} from '@tribeplatform/gql-client/types';

@Injectable()
export class AppService {
  private tribeClient: TribeClient;
  private tribeAccessToken: string;
  private readonly logger = new Logger(DatabaseService.name);
  private reportSpaceId: ID = '';

  private readonly LEADERBOARD_POST_TITLE = 'Kudos LeaderBoard';

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

  private async isKudosSpaceExist(): Promise<ID | null> {
    const spaces = await this.tribeClient.spaces.list({ limit: 10 }, 'basic');
    let spaceId: ID = null;
    spaces.edges.some((space) => {
      // TODO: get from config
      if (space.node.name === 'Kudos' && space.node.imageId === ':doughnut:') {
        spaceId = space.node.id;
        return true;
      }
      return false;
    });
    return spaceId;
  }

  private async createKudosReportSpace(members: ID[]): Promise<ID> {
    try {
      const spaceId = await this.isKudosSpaceExist();
      if (spaceId) {
        this.logger.verbose(`Space already created.`);
        return spaceId;
      }
      const kudosSpace = await this.tribeClient.spaces.create({
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
      });
      return kudosSpace.id;
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async setTribeClientToken() {
    this.tribeAccessToken = await this.tribeClient.generateToken({
      networkId: this.configService.get('TRIBE_NETWORK_ID'),
      memberId: this.configService.get('TRIBE_MY_ADMIN_ID'),
    });
    this.tribeClient.setToken(this.tribeAccessToken);
  }

  private async initialKudosApp(): Promise<void> {
    await this.setTribeClientToken();
    const membersId = await this.addMembers();
    this.reportSpaceId = await this.createKudosReportSpace(membersId);
    this.updateLeaderboardAtKudosSpace(this.reportSpaceId);
  }

  public getLeaderBoardAsHTML() {
    const leaderboard = this.databaseService.getLeaderboard();
    let htmlLeaderboard = '<table>';
    leaderboard.forEach((item, index) => {
      htmlLeaderboard += `<tr><td>No.${index + 1}</td><td>${item[0]}</td><td>${
        item[1]
      }</td><td>${item[2]}</td></tr>`;
    });
    return htmlLeaderboard + '</table>';
  }

  private getLeaderBoardAsPost() {
    return {
      title: JSON.stringify(this.LEADERBOARD_POST_TITLE),
      content: JSON.stringify(this.getLeaderBoardAsHTML()),
      previewImageId: '',
    };
  }

  private async createLeaderboardPost(
    spaceId: ID,
    title: string,
    content: string,
  ): Promise<void> {
    const postTypeId = await this.findPostTypeId();
    this.tribeClient.posts
      .create({
        spaceId,
        input: {
          postTypeId, //: postDiscussionType.node.id,
          mappingFields: [
            {
              key: 'title',
              type: PostMappingTypeEnum.TEXT,
              value: title,
            },
            {
              key: 'content',
              type: PostMappingTypeEnum.HTML,
              value: content,
            },
          ],
          publish: true,
        },
      })
      .then((result) => {
        this.logger.verbose(`Leaderboard post created! ${result.id}`);
      })
      .catch((error) => {
        this.logger.error(error);
      });
  }

  private updateLeaderBoardPost(postId: ID, title: string, content: string) {
    this.tribeClient.posts
      .update({
        id: postId,
        input: {
          mappingFields: [
            {
              key: 'title',
              type: PostMappingTypeEnum.TEXT,
              value: title,
            },
            {
              key: 'content',
              type: PostMappingTypeEnum.HTML,
              value: content,
            },
          ],
          publish: true,
        },
      })
      .then((result) => {
        this.logger.verbose(`Leaderboard post updated! ${result.id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  private async findPostTypeId(): Promise<ID> {
    const postTypes = await this.tribeClient.posts.listPostTypes({
      limit: 10,
      context: PostTypeContext.POST,
    });
    const postDiscussionType = postTypes.edges.filter(
      (edge) => edge.node.context === 'post' && edge.node.name === 'Discussion',
    )[0];
    return postDiscussionType.node.id;
  }

  private updateLeaderboardAtKudosSpace(spaceId: ID) {
    const leaderBoardPost = this.getLeaderBoardAsPost();
    this.tribeClient.posts.list({ limit: 2, spaceId }).then((posts) => {
      let leaderboardPostId = '';
      posts.edges.some((edge) => {
        if (edge.node.title === this.LEADERBOARD_POST_TITLE) {
          leaderboardPostId = edge.node.id;
          return true;
        }
        return false;
      });
      if (!leaderboardPostId) {
        this.createLeaderboardPost(
          spaceId,
          leaderBoardPost.title,
          leaderBoardPost.content,
        );
      }
      this.updateLeaderBoardPost(
        leaderboardPostId,
        leaderBoardPost.title,
        leaderBoardPost.content,
      );
    });
  }
}
