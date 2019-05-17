#!/bin/bash

VERSION=`sentry-cli releases propose-version`

printf "\nBuilding version $VERSION...\n\n"
sentry-cli releases new "$VERSION"

printf "\nSet-commits $VERSION...\n"
sentry-cli releases set-commits "$VERSION" --auto
