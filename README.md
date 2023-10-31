# A Simple CRUD API using CDK TypeScript

![Screenshot 2023-10-30 at 15 39 51](https://github.com/hungds99/aws-serverless-crud-api/assets/34293141/7a09e4b3-f9f6-4c29-81ef-861d680dd9a2)

You should explore the contents of this project. It demonstrates a CDK app with stacks:
  - `dynamodbCdkStack`: Build dynamodb table
  - `lambdaCdkStack`: Build lambda function
  - `apiCdkStack`: Build api gateway

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Prerequisites
* Node.js
* AWS CLI
* AWS CDK
* AWS Account

## How to run
 - Clone this repository
 - Run the following commands:
   - `cd aws-serverless-crud-api`
   - `npm install`
   - Configure your AWS credentials
   - Copy `.env.example` to `.env` and update the values
   - `cdk deploy --all` -> Deploy all stacks
   - Play with the API
   - `cdk destroy --all` -> Destroy all stacks

## APIs
* `GET /api/users`: Get all users
* `GET /api/users/{id}`: Get user by id
* `POST /api/users`: Create new user
* `DELETE /api/users/{id}`: Delete user by id
* `PUT /api/users/{id}`: Update user by id

## How to create an API

### Step 1: Create a table in DynamoDB
```typescript
const usersTable = new Table(this, 'usersTable', {
  tableName: TableNames.USERS,
  partitionKey: { name: 'id', type: AttributeType.STRING },
  billingMode: BillingMode.PAY_PER_REQUEST
});
```

### Step 2: Create a lambda function
- Add a lambda handler in `src/handlers/user.ts`
```typescript
export const createUser = async (event: any): Promise<any> => {
  const user = await userService.save(JSON.parse(event.body));
  return { statusCode: 201, body: JSON.stringify(user) };
};
```
- Define a lambda function
```typescript
const createUserFn = new NodejsFunction(this, 'createUserFn', {
  functionName: 'createUserFn',
  description: 'Create user',
  entry: 'src/handlers/user.ts',
  handler: 'createUser',
});
```
- Grant permission to access DynamoDB
```typescript
usersTable.grantReadWriteData(createUserFn);
```

### Step 3: Create an API Gateway
```typescript
const restApi = new RestApi(this, 'userManagementRestApi', {
  restApiName: 'User Management API',
  description: 'User management REST API',
});
```

### Step 4: Create resources and methods with Lambda integration
```typescript
const users = apiRoot.addResource('users');
const createUserIntegration = new LambdaIntegration(createUserFn);
users.addMethod('POST', createUserIntegration);
```

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
