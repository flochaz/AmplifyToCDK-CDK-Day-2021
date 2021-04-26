import * as cdk from '@aws-cdk/core';
import * as cfn_inc from '@aws-cdk/cloudformation-include';
import s3deploy = require('@aws-cdk/aws-s3-deployment');
import { Auth } from './auth-nested-stack';
import { AmplifyInitResource } from './amplify-init-resources';

export interface ApiProps extends cdk.NestedStackProps {
  auth: Auth;
  amplifyInitResource: AmplifyInitResource,
  amplifyEnvName?: string;
}

export class Api extends cdk.NestedStack {
  public readonly graphqlApiEndpoint: cdk.CfnOutput;
  public readonly graphqlApiKey: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, props: ApiProps) {
    super(scope, id);


    const pathPrefix = 'generated';
    const resolverDeployment = new s3deploy.BucketDeployment(
      this,
      'resolvers',
      {
        sources: [
          s3deploy.Source.asset(`${__dirname}/../../amplifyApp/amplify/backend/api/cdkdaydemo/build`),
        ],
        destinationBucket: props.amplifyInitResource.deploymentBucket,
        destinationKeyPrefix: pathPrefix,
      }
    );

    const template = new cfn_inc.CfnInclude(this, 'Api', {
      templateFile: `${__dirname}/../../amplifyApp/amplify/backend/api/cdkdaydemo/build/cloudformation-template.json`,
      parameters: {
        env: props.amplifyEnvName?props.amplifyEnvName:'NONE',
        S3DeploymentBucket: props.amplifyInitResource.deploymentBucket.bucketName,
        S3DeploymentRootKey: pathPrefix,
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
