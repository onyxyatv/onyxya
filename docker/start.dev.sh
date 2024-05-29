#!/bin/bash

cd /onyxya
npm -w packages/backend run start:dev &
npm -w packages/frontend run dev
