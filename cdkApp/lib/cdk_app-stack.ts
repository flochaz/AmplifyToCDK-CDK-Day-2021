import * as cdk from '@aws-cdk/core';
import { AmplifyInitResource } from './amplify-init-resources';
import { Storage } from './storage-nested-stack';
import { Auth } from './auth-nested-stack';
import { Api } from './api-nested-stack';

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

    // const config = {
    //   aws_project_region: cdk.Stack.of(this).region,
    //   aws_cognito_identity_pool_id: auth.identityPoolId.value,
    //   aws_cognito_region: cdk.Stack.of(auth).region,
    //   aws_user_pools_id: auth.userPoolId.value,
    //   aws_user_pools_web_client_id: auth.webClientId.value,
    //   oauth: {},
    //   aws_user_files_s3_bucket: storage.userFileBucketName.value,
    //   aws_user_files_s3_bucket_region: cdk.Stack.of(storage).region,
    //   aws_appsync_graphqlEndpoint: api.graphqlApiEndpoint.value,
    //   aws_appsync_region: cdk.Stack.of(api).region,
    //   aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
    // };

    // const awsExportJSON = new cdk.CfnOutput(this, 'aws-export', {
    //   value: JSON.stringify(config),
    // });

    // awsExportJSON.node.addDependency(auth);
    // awsExportJSON.node.addDependency(api);
    // awsExportJSON.node.addDependency(storage);

    new cdk.CfnOutput(this, 'aws_project_region', {
      value: cdk.Stack.of(this).region
    });
    new cdk.CfnOutput(this, 'aws_cognito_identity_pool_id', {
      value: auth.identityPoolId.value
    });
    new cdk.CfnOutput(this, 'aws_cognito_region', {
      value: cdk.Stack.of(auth).region
    });
    new cdk.CfnOutput(this, 'aws_user_pools_id', {
      value: auth.userPoolId.value
    });
    new cdk.CfnOutput(this, 'aws_user_pools_web_client_id', {
      value: auth.webClientId.value
    });
    new cdk.CfnOutput(this, 'aws_user_files_s3_bucket', {
      value: storage.userFileBucketName.value
    });
    new cdk.CfnOutput(this, 'aws_user_files_s3_bucket_region', {
      value: cdk.Stack.of(storage).region
    });
    new cdk.CfnOutput(this, 'aws_appsync_graphqlEndpoint', {
      value: api.graphqlApiEndpoint.value
    });
    new cdk.CfnOutput(this, 'aws_appsync_region', {
      value: cdk.Stack.of(api).region
    });
    new cdk.CfnOutput(this, 'aws_appsync_authenticationType', {
      value: 'AMAZON_COGNITO_USER_POOLS'
    });
  }
}
