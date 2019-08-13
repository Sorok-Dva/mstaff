#!/bin/bash

UPLOADS_PATH=./public/uploads
DESTINATION=.

printf "\nCompressing uploads folder into tar.gz archive (PATH=$UPLOADS_PATH) -> ${UPLOADS_PATH}/uploads_save_$(date +%d-%m-%Y).tar.gz...\n\n"
tar -zcvf ${DESTINATION}/uploads_save_$(date +%d-%m-%Y).tar.gz ${UPLOADS_PATH}
