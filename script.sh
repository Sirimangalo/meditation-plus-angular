#!/bin/bash
set -x

# Determine server and version based on tag or branch
if [ ! -z "$TRAVIS_TAG" ]
then
  server="meditation.sirimangalo.org"
  version=$TRAVIS_TAG
else
  server="meditation-dev.sirimangalo.org"
  version="$TRAVIS_BUILD_NUMBER.0.0"
fi

# set version
touch ./version.js
echo "exports.version = \"$version\";" > ./version.js

# set api config
touch ./src/api.config.ts
echo "export class ApiConfig {
  public static url: string = 'https://$server';
};" > ./src/api.config.ts

# rc6 fix for ng2-charts
# TODO: remove since rc6 pr has been merged
sed -i -- 's/common_1.FORM_DIRECTIVES,//g' node_modules/ng2-charts/components/charts/charts.js