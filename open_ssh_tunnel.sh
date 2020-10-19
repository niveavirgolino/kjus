#!/bin/bash

set -e

ssh-add ./cnjinova.pem
ssh -fN -L 27017:10.0.22.39:27017 ubuntu@18.229.203.58
