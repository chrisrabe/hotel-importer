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

## Visualising the hotel import

If you want to visualise the progress of your import, there's an `import-visualiser`
application provided in the repository. To enable visualisation, please follow these steps:

1. Open `src/stream-importer/stream.ts`
2. Paste the following code in below line 41 (make sure that you also import axios)
    ```typescript
    downloadStream.on('downloadProgress', ({ transferred, total, percent }) => {
         (async () => {
             try {
                 await axios.post('http://localhost:8080/status', {
                     file: expectedFile,
                     percent,
                     transferred,
                     total,
                 }, {
                     headers: {
                         'Content-Type': 'application/json'
                     }
                 });
             } catch (e) {}
         })();
    });
    ```
3. Open another terminal window and go into the `importer-visualiser` folder
4. Install all dependencies `npm install`
5. Run the app `npm start`
6. Open your browser and go into `http://localhost:8080`
7. In another terminal, run your importer using `npm run dev` and watch your webapp dynamically generate progress bars.
