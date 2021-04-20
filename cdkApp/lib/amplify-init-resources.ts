import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';

export class AmplifyInitResource extends cdk.Construct {
  public readonly authRole: iam.Role;
  public readonly unAuthRole: iam.Role;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    const prefix = `cdkgen-cdkdaydemo`;
    this.authRole = new iam.Role(this, 'AuthRole', {
      roleName: `${prefix}-authRole`,
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
      roleName: `${prefix}-unAuthRole`,
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
  }
}
