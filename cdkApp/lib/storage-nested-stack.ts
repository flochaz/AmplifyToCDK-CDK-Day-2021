import * as cdk from '@aws-cdk/core';
import * as cfn_inc from '@aws-cdk/cloudformation-include';

import { AmplifyInitResource } from './amplify-init-resources';

export interface StorageProps extends cdk.NestedStackProps {
  amplifyInitResource: AmplifyInitResource;
  amplifyEnvName?: string;
}

export class Storage extends cdk.NestedStack {
  public readonly userFileBucketName: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, props: StorageProps) {
    super(scope, id);

    const storageNestedStack = new cfn_inc.CfnInclude(this, 'Storage', {
      templateFile: `${__dirname}/../../amplifyApp/amplify/backend/storage/s31f5e069a/s3-cloudformation-template.json`,
      // From cdkApp/lib/backend/storage/s31f5e069a/parameters.json
      parameters: {
        env: props.amplifyEnvName,
        bucketName: `storage`,
        authPolicyName: `authPolicyName`,
        unauthPolicyName: `unauthPolicyName`,
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
        s3PublicPolicy: `Public_policy`,
        s3PermissionsAuthenticatedUploads: 's3:PutObject',
        s3UploadsPolicy: `Uploads_policy`,
        s3PermissionsAuthenticatedProtected:
          's3:PutObject,s3:GetObject,s3:DeleteObject',
        s3ProtectedPolicy: `Protected_policy`,
        s3PermissionsAuthenticatedPrivate:
          's3:PutObject,s3:GetObject,s3:DeleteObject',
        s3PrivatePolicy: `Private_policy`,
        AuthenticatedAllowList: 'ALLOW',
        s3ReadPolicy: `read_policy`,
        s3PermissionsGuestPublic: 's3:GetObject',
        s3PermissionsGuestUploads: 'DISALLOW',
        GuestAllowList: 'ALLOW',
        triggerFunction: 'NONE',
      },
    });

    this.userFileBucketName = storageNestedStack.getOutput('BucketName');
  }
}
