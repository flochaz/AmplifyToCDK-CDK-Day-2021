import * as cdk from "@aws-cdk/core";
import * as cloudfront from "@aws-cdk/aws-cloudfront";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";

export interface FrontendHostingStackProps extends cdk.NestedStackProps {}

export class FrontendHostingStack extends cdk.NestedStack {
  public websiteBucket: s3.Bucket;

  constructor(scope: cdk.Construct, id: string, props: FrontendHostingStackProps) {
    super(scope, id, props);

    // CloudFront Dist
    // S3
    // Creates a distribution for a S3 bucket.
    this.websiteBucket = new s3.Bucket(this, "WebsiteBucket");
    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: { origin: new origins.S3Origin(this.websiteBucket) },
      defaultRootObject: "index.html",
    });

    // S3 Deployment
    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset(`${__dirname}/../../amplifyApp/build`)],
      destinationBucket: this.websiteBucket,
      distribution: distribution,
    });

    new cdk.CfnOutput(this, "CloudFrontUrl", {
      value: distribution.distributionDomainName,
    })
  }
}
