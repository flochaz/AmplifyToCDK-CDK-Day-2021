import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';



export class AmplifyInitResource extends cdk.Construct {
  public readonly authRole: iam.Role;
  public readonly unAuthRole: iam.Role;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.authRole =  new iam.Role(this, "AuthRole", {
      roleName: "AuthRole",
      assumedBy: new iam.AnyPrincipal()
    });

    this.unAuthRole =  new iam.Role(this, "UnAuthRole", {
      roleName: "UnAuthRole",
      assumedBy: new iam.AnyPrincipal()
    });

  }
}