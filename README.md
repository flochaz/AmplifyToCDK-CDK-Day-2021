# OUTDATED

Now Amplify support CDK export : https://aws.amazon.com/blogs/mobile/export-amplify-backends-to-cdk-and-use-with-existing-deployment-pipelines/ !!!

# How to go from an Amplify app to CDK

This repo an example on how to migrate an Amplify App to CDK with a no modification of Amplify side and a minimum of CDK code.

- [Amplify app setup](#amplify-app-setup)
- [CDK app init](#cdk-app-init)
- [Migrate](#migrate)
  * [Intro: Topology of an amplify project](#intro--topology-of-an-amplify-project)
  * [Let's migrate !](#let-s-migrate--)
    + [Simple categories only (not applicable to the cloned example here)](#simple-categories-only--not-applicable-to-the-cloned-example-here-)
    + [Amplify init migration](#amplify-init-migration)
      - [Amplify Storage category migration](#amplify-storage-category-migration)
      - [Amplify Auth category migration](#amplify-auth-category-migration)
    + [Amplify AppSync API category migration](#amplify-appsync-api-category-migration)
  * [Replace some Amplify Console features](#replace-some-amplify-console-features)
    + [CDK web hosting](#cdk-web-hosting)
    + [CDK CI/CD](#cdk-ci-cd)
  * [The main cdk stack](#the-main-cdk-stack)
  * [The result](#the-result)

<small><i><a href='http://ecotrust-canada.github.io/markdown-toc/'>Table of contents generated with markdown-toc</a></i></small>


# Amplify app setup

```bash
# here I use a public example but feel free to use yours directly
git clone https://github.com/aws-samples/aws-amplify-graphql.git amplifyApp

cd amplifyApp

amplify add auth
amplify add storage
amplify add api
```

If you want to test it and deploy it to your own env just run 

```bash
amplify push
```

But if you just want to migrate it straight to CDK, just run the following command in order to generate the necessary files needed for the migration

```bash
amplify api gql-compile
```

# CDK app init

```bash
cd ../
mkdir cdkApp
cdk init --language typescript
npm install
```


# Migrate

## Intro: Topology of an amplify project

Amplify CLI will generate all it's necessary files under `amplify/backend` folder. And the structure will follow a strict pattern:

```
├── amplify
│   ├── backend
│   │   ├── amplify-meta.json
│   │   ├── CATEGORY
│   │   │   └── INSTANCE_NAME
│   │   │       ├── parameters.json
│   │   │       ├── XXXX-cloudformation-template.json
```

Where 
* CATEGORY is what you put after `amplify add` command when adding stuff such as `amplify add auth` where `auth` will be your category.
* INSTANCE_NAME is what you give as name in the first question asked by the CLI.


Here is the tree of the current app we are going to migrate:

```
.
├── amplify
│   ├── backend
│   │   ├── amplify-meta.json
│   │   ├── api
│   │   │   └── cdkdaydemo
│   │   │       ├── parameters.json
│   │   │       ├── resolvers
│   │   │       ├── schema.graphql
│   │   │       ├── stacks
│   │   │       │   └── CustomResources.json
│   │   │       └── transform.conf.json
│   │   ├── auth
│   │   │   └── cdkdaydemo5e0d5323
│   │   │       ├── cdkdaydemo5e0d5323-cloudformation-template.yml
│   │   │       └── parameters.json
│   │   ├── awscloudformation
│   │   │   └── nested-cloudformation-stack.yml
│   │   ├── backend-config.json
│   │   ├── storage
│   │   │   └── s31f5e069a
│   │   │       ├── parameters.json
│   │   │       ├── s3-cloudformation-template.json
│   │   │       └── storage-params.json
│   │   └── tags.json
│   ├── cli.json
│   └── team-provider-info.json
├── package-lock.json
├── package.json
├── public
    ...
├── schema.graphql
└── src
    ...
```

Few elements have to be highlighted here:
* `parameters.json` store the input paramaters comming from other stack or Amplify CLI input given at `amplify add <CATEGORY>` stage
* `*-template.json` or `*-template.yml` are the cloudformation templates used by `amplify push` to create the nested stack
* the root stack is in `awscloudformation`/`nested-cloudformation-stack.yml`
* its a bit specific for api category **api**/**cdkdaydemo**
    * cloudformation templates are in **build/stacks**
    * resolvers are in **build/resolvers**
    * appsync api schema is in **build/schema.graphql**

That are the files we will mainly have to deal with !


## Let's migrate !

1. Note your `backend` Amplify folder path from your cdkApp lib folder. We are going to make reference to those amplify files all along the migration

```
ls ../amplifyApp/amplify/backend
```

1. import the key lib : `@aws-cdk/cloudformation-include`

```
npm install @aws-cdk/cloudformation-include
```

### Simple categories only (not applicable to the cloned example here)

If your Amplify app is only composed of "simple" categories (which means your `backend/CATEGORY/INSTANCE` folder only contains cloudformation templates) then you can directly use the amplify root stack located under `backend/awscloudformation/nested-cloudformation-stack.yml` .


Check [cdkApp/lib/all-in-one-stack.ts](cdkApp/lib/all-in-one-stack.ts) for more details.

### Amplify init migration

If you have "more complex" categories (containing more than cfn templates) then you need to rewrite init resources in CDK:

When running amplify init a stack is executed that create the following resources:

* AuthRole 
* UnauthRole
* DeploymentBucket

First step would be to create equivalents in CDK: check [cdkApp/lib/amplify-init-resources.ts](cdkApp/lib/amplify-init-resources.ts)

#### Amplify Storage category migration

Storage is a "simple" category so it can be easily included with cloudformation-include construct: Check [cdkApp/lib/storage-nested-stack.ts](cdkApp/lib/storage-nested-stack.ts).


#### Amplify Auth category migration

Auth is a "simple" category so it can be easily included with cloudformation-include construct: Check [cdkApp/lib/auth-nested-stack.ts](cdkApp/lib/auth-nested-stack.ts). But `amplify cli` generated `yml` template for this category and for some reason cdk might complains while deploying with an error like
```
Template format error: unsupported value for AWSTemplateFormatVersion.
```
The solution: `cfn-flip` to convert it to json
```
cfn-flip ../amplifyApp/amplify/backend/auth/cdkdaydemo5e0d5323/cdkdaydemo5e0d5323-cloudformation-template.yml ../amplifyApp/amplify/backend/auth/cdkdaydemo5e0d5323/cdkdaydemo5e0d5323-cloudformation-template.json
```

### Amplify AppSync API category migration

(AppSync) Api is a "more complex" category: it's made of cloudformation, vtl files, potential lambda functions handlers etc.  cloudformation-include construct is not enough to handle all that. 

check [cdkApp/lib/api-nested-stack.ts](cdkApp/lib/api-nested-stack.ts) to see how to leverage `s3-deployment` construct to upload the missing artefacts.

## Replace some Amplify Console features

Amplify console is providing several services such web hosting and CI/CD. 

For CI/CD, now that we are in a CDK app we can either continue using Amplify Console CI/CD and simply create an amplify.yml file to customize CI/CD to now deploy the resources through `cdk deploy` CLI instead of `amplify push` or we can embrasse CDK capability and move to CDK pipelines. 

Same for Web Hosting ...

### CDK web hosting

[cdkApp/lib/cdk-frontend-hosting-nested-stack.ts](cdkApp/lib/cdk-frontend-hosting-nested-stack.ts) shows a way to create and deploy your frontend to S3 + Cloudfront

[cdkApp/lib/cdk-frontend-config-stack.ts](cdkApp/lib/cdk-frontend-config-stack.ts) shows how to pass backend config to frontend (check [amplifyApp/src/index.js](amplifyApp/src/index.js) to see how the config is dynamically loaded on client side).

### CDK CI/CD

I didn't got to the point of adding CI/CD but it is quite easy with [cdk pipelines](https://aws.amazon.com/blogs/developer/cdk-pipelines-continuous-delivery-for-aws-cdk-applications/) construct but I might in the future.

## The main cdk stack

[cdkApp/lib/cdk_app-stack.ts](cdkApp/lib/cdk_app-stack.ts) contains the glue between all the element I described here.


## The result

After synthesizing your app running the following commands, you should be able to see that the `cdkApp/cdk.out/CdkAppStack.template.json` looks a lot like the `backend/awscloudformation/nested-cloudformation-stack.yml` , the only difference being the resources logical Ids and way to build nested stacks template Url.

```bash
npm run build
npm run cdk synth
```
