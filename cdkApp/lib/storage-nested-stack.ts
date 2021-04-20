import * as cdk from '@aws-cdk/core';
import * as cfn_inc from '@aws-cdk/cloudformation-include';

import { AmplifyInitResource } from './amplify-init-resources';

export interface StorageProps extends cdk.NestedStackProps {
  amplifyInitResource: AmplifyInitResource;
}

export class Storage extends cdk.NestedStack {
  userFileBucketName: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, props: StorageProps) {
    super(scope, id);

    const prefix = `cdkgen-cdkdaydemo`;
    const storageNestedStack = new cfn_inc.CfnInclude(this, 'Storage', {
      templateFile: `${__dirname}/../../amplifyApp/amplify/backend/storage/s31f5e069a/s3-cloudformation-template.json`,
      // From cdkApp/lib/backend/storage/s31f5e069a/parameters.json
      parameters: {
        env: 'NONE',
        bucketName: `${prefix}-storage`,
        authPolicyName: `${prefix}-authPolicyName`,
        unauthPolicyName: `${prefix}-unauthPolicyName`,
        authRoleName: props.amplifyInitResource.authRole.roleName,
        unauthRoleName: props.amplifyInitResource.unAuthRole.roleName,
        selectedGuestPermissions: ['s3:GetObject', 's3:ListBucket'],
        selectedAuthenticatedPermissions: [
          's3:PutObject',
          's3:GetObject',
          's3:ListBucket',
          's3:DeleteObject',
        ],
        s3PermissionsAuthenticatedPublic:
          's3:PutObject,s3:GetObject,s3:DeleteObject',
        s3PublicPolicy: `${prefix}-Public_policy`,
        s3PermissionsAuthenticatedUploads: 's3:PutObject',
        s3UploadsPolicy: `${prefix}-Uploads_policy`,
        s3PermissionsAuthenticatedProtected:
          's3:PutObject,s3:GetObject,s3:DeleteObject',
        s3ProtectedPolicy: `${prefix}-Protected_policy`,
        s3PermissionsAuthenticatedPrivate:
          's3:PutObject,s3:GetObject,s3:DeleteObject',
        s3PrivatePolicy: `${prefix}-Private_policy`,
        AuthenticatedAllowList: 'ALLOW',
        s3ReadPolicy: `${prefix}-read_policy`,
        s3PermissionsGuestPublic: 's3:GetObject',
        s3PermissionsGuestUploads: 'DISALLOW',
        GuestAllowList: 'ALLOW',
        triggerFunction: 'NONE',
      },
    });

    this.userFileBucketName = storageNestedStack.getOutput('BucketName');
  }
}
