#!/bin/sh

npm -w @onyxyatv/backend run start:dev &
npm -w @onyxyatv/frontend run dev --host
