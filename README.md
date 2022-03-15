# Hotel Importer

## Overview
This is the source code for the prototype of the hotel importer. Use this for
experimentation or manual imports.

## Getting Started

1. Create a `.env` file with the following contents
    ```shell
    GMX_USER=<CHANGE_ME>
    GMX_PASSWORD=<CHANGE_ME>

    ELASTIC_USER=user
    ELASTIC_PASS=password
    ELASTIC_URL_PROTOCOL=http
    ELASTIC_HOST=localhost:9200

    ELASTIC_INDEX=<CHANGE_ME>
    ```
2. Install dependencies through `npm install`
3. Run the application `npm run dev`

## Performing manual imports
1. Set up your importer to point to **your local elasticsearch**
2. Run the importer using `npm run dev`
3. Use the `transfer.sh` script to migrate the newly created index to the environment you wish to migrate the index over to.
    ```shell
    INDEX_NAME=<NEW_INDEX_NAME> \
    INPUT_DB="http://localhost:9200" \
    OUTPUT_DB="https://<user>:<password>@<elasticsearch-instance>" \
    ./transfer.sh "$INDEX_NAME" "$INPUT_DB" "$OUTPUT_DB"
    ```
