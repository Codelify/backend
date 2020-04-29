#!/bin/bash

export NODE_ENV=development
printf "\n\n======================================\n"
printf "Making database migrations"
printf "\n======================================\n\n"

npm run migrate


printf "\n\n======================================\n"
printf "Start the application"
printf "\n======================================\n\n"
npm run dev

exit 0
