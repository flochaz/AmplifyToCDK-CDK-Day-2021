import * as cdk from '@aws-cdk/core';
import { AmplifyInitResource } from './amplify-init-resources';

export class CdkAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new AmplifyInitResource(this, 'AmplifyDefaultRole');
    
  }
}
