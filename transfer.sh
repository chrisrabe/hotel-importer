#!/bin/bash

INDEX_NAME="$1"
INPUT_DB="$2"
OUTPUT_DB="$3"

BATCH_SIZE=1000

elasticdump --input="${INPUT_DB}/${INDEX_NAME}" --output="${OUTPUT_DB}/${INDEX_NAME}" --type=data --limit="$BATCH_SIZE"
