import * as cdk from '@aws-cdk/core';
import * as cfn_inc from '@aws-cdk/cloudformation-include';
import s3deploy = require('@aws-cdk/aws-s3-deployment');
import s3 = require('@aws-cdk/aws-s3');
import { AmplifyInitResource } from './amplify-init-resources';
import { Auth } from './auth-nested-stack';

export interface ApiProps extends cdk.NestedStackProps {
  auth: Auth;
}

export class Api extends cdk.NestedStack {
  public readonly graphqlApiEndpoint: cdk.CfnOutput;
  public readonly graphqlApiKey: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, props: ApiProps) {
    super(scope, id);

    const resolverBucket = new s3.Bucket(this, 'amplifyResource');

    const resolverDeployment = new s3deploy.BucketDeployment(
      this,
      'resolvers',
      {
        sources: [
          s3deploy.Source.asset(`${__dirname}/../../amplifyApp/amplify/backend/api/cdkdaydemo/build`),
        ],
        destinationBucket: resolverBucket,
        destinationKeyPrefix: 'generated',
      }
    );

    const template = new cfn_inc.CfnInclude(this, 'QuizAPI', {
      templateFile: `${__dirname}/../../amplifyApp/amplify/backend/api/cdkdaydemo/build/cloudformation-template.json`,
      parameters: {
        S3DeploymentBucket: resolverBucket.bucketName,
        S3DeploymentRootKey: 'generated',
        CreateAPIKey: 0,
        AppSyncApiName: 'cdkdaydemo',
        DynamoDBBillingMode: 'PAY_PER_REQUEST',
        DynamoDBEnableServerSideEncryption: false,
        AuthCognitoUserPoolId: props.auth.userPoolId.value,
      },
    });
    template.node.addDependency(resolverDeployment);

    this.graphqlApiEndpoint = template.getOutput('GraphQLAPIEndpointOutput');
    this.graphqlApiKey = template.getOutput('GraphQLAPIKeyOutput');

  }
}
