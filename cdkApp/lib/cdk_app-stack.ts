import * as cdk from '@aws-cdk/core';
import { AmplifyInitResource } from './amplify-init-resources';
import { Storage } from './storage-nested-stack';
import { Auth } from './auth-nested-stack';
import { Api } from './api-nested-stack';
import { FrontendHostingStack } from './cdk-frontend-hosting-nested-stack';
import { FrontendConfig } from './cdk-frontend-config-stack';

export class CdkAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const amplifyInitResource = new AmplifyInitResource(
      this,
      'AmplifyDefaultRole'
    );

    const storage = new Storage(this, 'Storage', {
      amplifyInitResource: amplifyInitResource,
    });

    const auth = new Auth(this, 'Auth', {
      amplifyInitResource: amplifyInitResource,
    });

    const api = new Api(this, 'Api', {
      auth: auth,
    });

    const config = {
      aws_project_region: cdk.Stack.of(this).region,
      aws_cognito_identity_pool_id: auth.identityPoolId.value.toString(),
      aws_cognito_region: cdk.Stack.of(auth).region,
      aws_user_pools_id: auth.userPoolId.value.toString(),
      aws_user_pools_web_client_id: auth.webClientId.value.toString(),
      oauth: {},
      aws_user_files_s3_bucket: storage.userFileBucketName.value.toString(),
      aws_user_files_s3_bucket_region: cdk.Stack.of(storage).region,
      aws_appsync_graphqlEndpoint: api.graphqlApiEndpoint.value.toString(),
      aws_appsync_region: cdk.Stack.of(api).region,
      aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    };

    new cdk.CfnOutput(this, 'public/aws-export.json', {
      value: JSON.stringify(config),
    });

    const frontendHosting = new FrontendHostingStack(this, 'FrontendHosting', {});

    new FrontendConfig(this, 'aws-export', {
      siteBucket: frontendHosting.websiteBucket,
      config: config,
    });
  }
}
