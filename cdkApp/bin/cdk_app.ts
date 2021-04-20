#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkAppStack } from '../lib/cdk_app-stack';

const app = new cdk.App();
new CdkAppStack(app, 'CdkAppStack');
