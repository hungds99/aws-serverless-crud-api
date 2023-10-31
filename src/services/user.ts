import {
  DeleteCommand,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  ScanCommand
} from '@aws-sdk/lib-dynamodb';
import { TableNames } from '../common/contains';
import ddbDocClient from '../config/dynamodbClient';

export default class UserService {
  private readonly ddbDocClient = ddbDocClient;

  constructor() {}

  async save(user: any) {
    const params = {
      TableName: TableNames.USERS,
      Item: user
    };
    const putCommand = new PutCommand(params);
    await this.ddbDocClient.send(putCommand);
    return user;
  }

  async findAll() {
    const params = {
      TableName: TableNames.USERS
    };
    const scanCommand = new ScanCommand(params);
    const { Items } = await this.ddbDocClient.send(scanCommand);
    return Items;
  }

  async findById(id: number) {
    const params: GetCommandInput = {
      TableName: TableNames.USERS,
      Key: { id: id }
    };
    const getCommand = new GetCommand(params);
    const { Item } = await this.ddbDocClient.send(getCommand);
    return Item;
  }

  async deleteById(id: number) {
    const params: GetCommandInput = {
      TableName: TableNames.USERS,
      Key: { id: id }
    };
    const getCommand = new GetCommand(params);
    const { Item } = await this.ddbDocClient.send(getCommand);
    if (Item) {
      const params = {
        TableName: TableNames.USERS,
        Key: { id: id }
      };
      const deleteCommand = new DeleteCommand(params);
      await this.ddbDocClient.send(deleteCommand);
      return Item;
    }
    return null;
  }

  async updateById(id: number, user: any) {
    const params: GetCommandInput = {
      TableName: TableNames.USERS,
      Key: { id: id }
    };
    const getCommand = new GetCommand(params);
    const { Item } = await this.ddbDocClient.send(getCommand);
    if (Item) {
      const params: PutCommandInput = {
        TableName: TableNames.USERS,
        Item: user
      };
      const putCommand = new PutCommand(params);
      await this.ddbDocClient.send(putCommand);
      return user;
    }
    return null;
  }
}
