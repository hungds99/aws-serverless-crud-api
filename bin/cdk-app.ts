#!/usr/bin/env node
import { App } from 'aws-cdk-lib';
import 'dotenv/config';
import ApigatewayStack from './stacks/apigateway';
import DynamodbStack from './stacks/dynamodb';
import LambdaStack from './stacks/lambda';

const buildConfig = () => {
  const config = {
    accountId: process.env.AWS_ACCOUNT_ID,
    region: process.env.AWS_REGION
  };

  if (!config.accountId || !config.region) {
    throw new Error(
      'Missing AWS_ACCOUNT_ID or AWS_REGION environment variables'
    );
  }
  return config;
};

const main = () => {
  const app = new App();

  const { accountId, region } = buildConfig();
  const env = {
    account: accountId,
    region: region
  };

  const dynamodbStack = new DynamodbStack(app, 'dynamodbCdkStack', {
    description: 'DynamoDB stack',
    env: env
  });
  const lambdaStack = new LambdaStack(app, 'lambdaCdkStack', {
    description: 'Lambda stack',
    env: env
  });
  const apigatewayStack = new ApigatewayStack(app, 'apigatewayCdkStack', {
    description: 'API Gateway stack',
    env: env
  });

  lambdaStack.addDependency(dynamodbStack);
  apigatewayStack.addDependency(lambdaStack);

  app.synth();
};
main();
