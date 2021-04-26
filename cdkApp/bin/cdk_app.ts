#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkAppStack } from '../lib/cdk_app-stack';

const app = new cdk.App();
const amplifyEnvName = 'staging';
const appName = 'cdkdaydemo';
const prefix = 'amptodk';
new CdkAppStack(app, 'CdkAppStack', { stackName: `${prefix}-${appName}-${amplifyEnvName}-root`, // each variable needs to be lower case and no "-"
  amplifyEnvName: amplifyEnvName,
});

// Using the root stack can't work since AppSync API stack requires resolvers to be deployed in between the stack and the nested stacks
// new AllInOne(this, 'AllInOne', {stackName: `amplify-cdkdaydemo-${amplifyEnvName}-212204`, amplifyEnvName: amplifyEnvName});
    
