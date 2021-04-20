import * as cdk from '@aws-cdk/core';
import * as cfn_inc from '@aws-cdk/cloudformation-include';

import { AmplifyInitResource } from './amplify-init-resources';

export interface AuthProps extends cdk.NestedStackProps {
  amplifyInitResource: AmplifyInitResource;
}

export class Auth extends cdk.NestedStack {
  public readonly auth: cfn_inc.CfnInclude;
  public readonly userPoolId: cdk.CfnOutput;
  public readonly identityPoolId: cdk.CfnOutput;
  public readonly webClientId: cdk.CfnOutput;

  constructor(scope: cdk.Construct, id: string, props: AuthProps) {
    super(scope, id);

    const prefix = `cdkgen-cdkdaydemo`;
    this.auth = new cfn_inc.CfnInclude(this, 'Auth', {
      templateFile: `${__dirname}/../../amplifyApp/amplify/backend/auth/cdkdaydemo5e0d5323/cdkdaydemo5e0d5323-cloudformation-template.json`,

      parameters: {
        env: 'NONE',
        identityPoolName: `${prefix}-cdkdaydemo_identitypool`,
        allowUnauthenticatedIdentities: true,
        resourceNameTruncated: 'cdkday',
        userPoolName: `${prefix}-cdkdaydemo_userpool`,
        autoVerifiedAttributes: ['email'],
        mfaConfiguration: 'OFF',
        mfaTypes: ['SMS Text Message'],
        smsAuthenticationMessage: 'Your authentication code is {####}',
        smsVerificationMessage: 'Your verification code is {####}',
        emailVerificationSubject: 'Your verification code',
        emailVerificationMessage: 'Your verification code is {####}',
        defaultPasswordPolicy: false,
        passwordPolicyMinLength: 8,
        passwordPolicyCharacters: [],
        requiredAttributes: ['email'],
        userpoolClientGenerateSecret: false,
        userpoolClientRefreshTokenValidity: 30,
        userpoolClientWriteAttributes: ['email'],
        userpoolClientReadAttributes: ['email'],
        userpoolClientLambdaRole: `${prefix}-cdkday_userpoolclient_lambda_role`,
        userpoolClientSetAttributes: false,
        sharedId: '5e0d5323',
        resourceName: 'cdkdaydemo5e0d5323',
        authSelections: 'identityPoolAndUserPool',
        authRoleArn: props.amplifyInitResource.authRole.roleArn,
        unauthRoleArn: props.amplifyInitResource.unAuthRole.roleArn,
        useDefault: 'default',
        userPoolGroupList: [],
        serviceName: 'Cognito',
        usernameCaseSensitive: false,
        dependsOn: [],
      },
    });


    this.userPoolId = this.auth.getOutput('UserPoolId');
    this.identityPoolId = this.auth.getOutput('IdentityPoolId');
    this.webClientId = this.auth.getOutput('AppClientIDWeb');
  }
}
