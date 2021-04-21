import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
import * as cr from '@aws-cdk/custom-resources';
import {Auth} from './auth-nested-stack';
import {Api} from './api-nested-stack';
import {Storage} from './storage-nested-stack';

export interface FrontendConfigProps extends cdk.NestedStackProps {
  siteBucket: s3.Bucket;
  config: any;
}

export class FrontendConfig extends cdk.NestedStack {
  constructor(scope: cdk.Construct, id: string, props: FrontendConfigProps) {
    super(scope, id, props);

    new cr.AwsCustomResource(this, 'PutFrontendConfig', {
      onUpdate: {
        service: 'S3',
        action: 'putObject',
        physicalResourceId: cr.PhysicalResourceId.of(Date.now().toString()),
        parameters: {
          Body: JSON.stringify(props.config),
          Bucket: props.siteBucket.bucketName,
          Key: 'aws-export.json',
        },
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: [
          props.siteBucket.bucketArn,
          `${props.siteBucket.bucketArn}/*`,
        ],
      }),
    });
  }
}
