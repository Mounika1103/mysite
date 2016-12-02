#!/bin/bash
SCRIPT=$(readlink -f "$0")
SCRIPTPATH=$(dirname "$SCRIPT")

# Geting Vectorscient Toolkit Depedencies
git clone -b engine https://github.com/Vectorscient/vectorscient_toolkit.git $SCRIPTPATH/vectorscient_toolkit
