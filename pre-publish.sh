#!/usr/bin/env bash

set -e

tsc -p src
tsc -p src/package
unlink dist/npm-package/package.json || true

cd src/package/
ncu -a -u
cd ../..

cp src/package/package.json dist/npm-package/package.json
cd dist/npm-package
npm publish --access=public
