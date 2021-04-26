import * as cdk from '@aws-cdk/core';
import * as cfn_inc from '@aws-cdk/cloudformation-include';
import s3deploy = require('@aws-cdk/aws-s3-deployment');

export interface AllInOneProps extends cdk.StackProps {
  amplifyEnvName: string;
}

export class AllInOne extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: AllInOneProps) {
    super(scope, id, props);

    const rootTemplate = new cfn_inc.CfnInclude(this, 'RootTemplate', {
      templateFile: `${__dirname}/../../amplifyApp/amplify/backend/awscloudformation/nested-cloudformation-stack.yml`,
      parameters: {
        DeploymentBucketName: `${this.stackName}-deployment`,
        AuthRoleName: `${this.stackName}-authRole`,
        UnauthRoleName: `${this.stackName}-unAuthRole`,
      },
      loadNestedStacks: {
        apicdkdaydemo: {
          templateFile: `${__dirname}/../../amplifyApp/amplify/backend/api/cdkdaydemo/build/cloudformation-template.json`,
          // Need to override some parameters because of nested stack import failure due to string type expected
          parameters: {
            env: props.amplifyEnvName,
            CreateAPIKey: "0",
            DynamoDBEnableServerSideEncryption: "false"
          }
        },
        authcdkdaydemo5e0d5323: {
          templateFile: `${__dirname}/../../amplifyApp/amplify/backend/auth/cdkdaydemo5e0d5323/cdkdaydemo5e0d5323-cloudformation-template.json`,
          // Need to override some parameters because of nested stack import failure due to string type expected
          parameters: {
            env: props.amplifyEnvName,
            allowUnauthenticatedIdentities: "true",
            defaultPasswordPolicy: "false",
            passwordPolicyMinLength: "8",
            userpoolClientGenerateSecret: "false",
            userpoolClientRefreshTokenValidity: "30",
            userpoolClientSetAttributes: "false",
            usernameCaseSensitive: "false"
          }
        },
        storages31f5e069a: {
          templateFile: `${__dirname}/../../amplifyApp/amplify/backend/storage/s31f5e069a/s3-cloudformation-template.json`,
          parameters: {
            env: props.amplifyEnvName,
          }
        },
      },
    });
  }
}
