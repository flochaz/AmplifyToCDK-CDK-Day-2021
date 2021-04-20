# AmplifyToCDK-CDK-Day-2021

## Amplify app setup

```
git clone https://github.com/aws-samples/aws-amplify-graphql.git amplifyApp

cd amplifyApp

amplify add auth
amplify add storage
amplify add api
amplify push

cd ../cdkApp

cdk init --language typescript
```

## CDK app init

```
cd -
mkdir cdkApp
cdk init --language typescript
npm install 
```