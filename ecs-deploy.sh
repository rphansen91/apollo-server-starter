#!/bin/bash

# install AWS SDK
# pip install --user awscli
# export PATH=$PATH:$HOME/.local/bin

# install necessary dependency for ecs-deploy
# add-apt-repository ppa:eugenesan/ppa
# apt-get update
# apt-get install jq -y

# install ecs-deploy
# curl https://raw.githubusercontent.com/silinternational/ecs-deploy/master/ecs-deploy | \
  # sudo tee -a /usr/bin/ecs-deploy
# sudo chmod +x /usr/bin/ecs-deploy

eval $(aws ecr get-login --no-include-email)

docker build -t $IMAGE_NAME .
docker tag $IMAGE_NAME $IMAGE_REPO_URL:$IMAGE_VERSION
docker push $IMAGE_REPO_URL:$IMAGE_VERSION

ecs-deploy -c $CLUSTER_NAME -n $SERVICE_NAME -i $IMAGE_REPO_URL:$IMAGE_VERSION