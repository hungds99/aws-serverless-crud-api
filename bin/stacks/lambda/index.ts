import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Table } from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { TableNames } from '../dynamodb';

export default class LambdaStack extends Stack {
  private readonly LAMBDA_TIMEOUT = Duration.seconds(10);

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const usersTable = Table.fromTableName(
      this,
      'usersTable',
      TableNames.USERS
    );

    const createUserFn = new NodejsFunction(this, 'createUserFn', {
      functionName: 'createUserFn',
      description: 'Create user',
      entry: 'src/handlers/user.ts',
      handler: 'createUser',
      timeout: this.LAMBDA_TIMEOUT
    });
    usersTable.grantReadWriteData(createUserFn);

    const getUsersFn = new NodejsFunction(this, 'getUsersFn', {
      functionName: 'getUsersFn',
      description: 'Get users',
      entry: 'src/handlers/user.ts',
      handler: 'getUsers',
      timeout: this.LAMBDA_TIMEOUT
    });
    usersTable.grantReadData(getUsersFn);

    const getUserFn = new NodejsFunction(this, 'getUserFn', {
      functionName: 'getUserFn',
      description: 'Get user',
      entry: 'src/handlers/user.ts',
      handler: 'getUser',
      timeout: this.LAMBDA_TIMEOUT
    });
    usersTable.grantReadData(getUserFn);

    const deleteUserFn = new NodejsFunction(this, 'deleteUserFn', {
      functionName: 'deleteUserFn',
      description: 'Delete user',
      entry: 'src/handlers/user.ts',
      handler: 'deleteUser',
      timeout: this.LAMBDA_TIMEOUT
    });
    usersTable.grantReadWriteData(deleteUserFn);

    const updateUserFn = new NodejsFunction(this, 'updateUserFn', {
      functionName: 'updateUserFn',
      description: 'Update user',
      entry: 'src/handlers/user.ts',
      handler: 'updateUser',
      timeout: this.LAMBDA_TIMEOUT
    });
    usersTable.grantReadWriteData(updateUserFn);
  }
}
