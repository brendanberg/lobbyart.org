#!/bin/bash
# set -x

AWS_ECR_REGISTRY_URL=$1
AWS_ECR_REPOSITORY_NAME=$2

# If COMMIT_TAG and VERSION_TAG are not set by the environment, we're probably
# running on a developer's local machine. Fetch the values from the git CLI.
: ${COMMIT_TAG:=$(git rev-parse HEAD)}
: ${VERSION_TAG:=$(git branch --show-current)}

# TODO: Short circuit if vars are not populated or if we don't have authorization

docker build \
    --platform linux/arm64 \
    --build-arg GITHUB_COMMIT_HASH=$() \
    --build-arg VERSION_NUMBER=$() \
    --target dist \
    -t $AWS_ECR_REPOSITORY_NAME:latest ./

docker tag $AWS_ECR_REPOSITORY_NAME:latest $AWS_ECR_REGISTRY_URL/$AWS_ECR_REPOSITORY_NAME:$COMMIT_TAG
docker tag $AWS_ECR_REPOSITORY_NAME:latest $AWS_ECR_REGISTRY_URL/$AWS_ECR_REPOSITORY_NAME:$VERSION_TAG

docker push $AWS_ECR_REGISTRY_URL/$AWS_ECR_REPOSITORY_NAME:$COMMIT_TAG
docker push $AWS_ECR_REGISTRY_URL/$AWS_ECR_REPOSITORY_NAME:$VERSION_TAG

if [ $TAG_LATEST = "true" ]; then
    docker tag $AWS_ECR_REPOSITORY_NAME:latest $AWS_ECR_REGISTRY_URL/$AWS_ECR_REPOSITORY_NAME:latest
    docker push $AWS_ECR_REGISTRY_URL/$AWS_ECR_REPOSITORY_NAME:latest
fi

for FUNCTION_NAME in $(aws lambda list-functions --query "Functions[?PackageType=='Image'].FunctionName" --output text); do
    aws lambda update-function-code \
        --output table \
        --no-cli-pager \
        --function-name "$FUNCTION_NAME" \
        --image-uri $AWS_ECR_REGISTRY_URL/$AWS_ECR_REPOSITORY_NAME:$COMMIT_TAG
done

echo "image-uri=$AWS_ECR_REGISTRY_URL/$AWS_ECR_REPOSITORY_NAME"
echo "image-tag=$COMMIT_TAG"
