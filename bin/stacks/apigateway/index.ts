import { Stack, StackProps } from 'aws-cdk-lib';
import { Cors, LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface ApigatewayStackProps extends StackProps {}
export default class ApigatewayStack extends Stack {
  constructor(scope: Construct, id: string, props?: ApigatewayStackProps) {
    super(scope, id, props);

    const restApi = new RestApi(this, 'userManagementRestApi', {
      restApiName: 'User Management API',
      description: 'User management REST API',
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
        allowHeaders: Cors.DEFAULT_HEADERS
      }
    });
    const apiRoot = restApi.root.addResource('api');

    // GET /users
    const users = apiRoot.addResource('users');
    const getUsersFn = Function.fromFunctionName(
      this,
      'getUsersFn',
      'getUsersFn'
    );
    users.addMethod('GET', new LambdaIntegration(getUsersFn));

    // POST /users
    const createUserFn = Function.fromFunctionName(
      this,
      'createUserFn',
      'createUserFn'
    );
    users.addMethod('POST', new LambdaIntegration(createUserFn));

    // GET /users/{id}
    const user = users.addResource('{id}');
    const getUserFn = Function.fromFunctionName(this, 'getUserFn', 'getUserFn');
    user.addMethod('GET', new LambdaIntegration(getUserFn));

    // DELETE /users/{id}
    const deleteUserFn = Function.fromFunctionName(
      this,
      'deleteUserFn',
      'deleteUserFn'
    );
    user.addMethod('DELETE', new LambdaIntegration(deleteUserFn));

    // PUT /users/{id}
    const updateUserFn = Function.fromFunctionName(
      this,
      'updateUserFn',
      'updateUserFn'
    );
    user.addMethod('PUT', new LambdaIntegration(updateUserFn));
  }
}
