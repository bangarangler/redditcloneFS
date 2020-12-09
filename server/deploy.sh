#1/bin/bash

echo What should the version be?
read VERSION

docker build -t bangarangler/reddit_clone:$VERSION .
docker push bangarangler/reddit_clone:$VERSION
ssh root@142.93.53.114 "docker pull bangarangler/reddit_clone:$VERSION && docker tag bangarangler/reddit_clone:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"