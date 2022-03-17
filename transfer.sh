#!/bin/bash

INDEX_NAME="$1"
INPUT_DB="$2"
OUTPUT_DB="$3"

BATCH_SIZE=1000

# create the index with the same mappings
elasticdump --input="${INPUT_DB}/${INDEX_NAME}" --output="${OUTPUT_DB}/${INDEX_NAME}" --type=mapping --limit="$BATCH_SIZE"
# copy the data to the destination index
elasticdump --input="${INPUT_DB}/${INDEX_NAME}" --output="${OUTPUT_DB}/${INDEX_NAME}" --type=data --limit="$BATCH_SIZE"
