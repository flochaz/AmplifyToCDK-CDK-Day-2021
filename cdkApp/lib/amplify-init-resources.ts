import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import s3 = require('@aws-cdk/aws-s3');

export class AmplifyInitResource extends cdk.Construct {
  public readonly authRole: iam.Role;
  public readonly unAuthRole: iam.Role;
  public readonly deploymentBucket: s3.Bucket;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.authRole = new iam.Role(this, 'AuthRole', {
      roleName: `${cdk.Stack.of(this).stackName}-authRole`,
      assumedBy: new iam.FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringLike: {
            'cognito-identity.amazonaws.com:aud': '*',
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'authenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
    });

    this.unAuthRole = new iam.Role(this, 'UnAuthRole', {
      roleName: `${cdk.Stack.of(this).stackName}-unAuthRole`,
      assumedBy: new iam.FederatedPrincipal(
        'cognito-identity.amazonaws.com',
        {
          StringLike: {
            'cognito-identity.amazonaws.com:aud': '*',
          },
          'ForAnyValue:StringLike': {
            'cognito-identity.amazonaws.com:amr': 'unauthenticated',
          },
        },
        'sts:AssumeRoleWithWebIdentity'
      ),
    });

    this.deploymentBucket = new s3.Bucket(this, 'amplifyResource');

  }
}
