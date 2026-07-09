import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import AdmZip from 'adm-zip';

const RAW_DATA_DIRECTORY = './data/raw';

const DATASETS_TO_DOWNLOAD = [
  { 
    fileName: 'kanji_jlpt_only.json', 
    url: 'https://raw.githubusercontent.com/Renairisu/jlpt_kanji_json_msgpack/main/kanji_jlpt_only.json',
    isZipArchive: false 
  },
  { 
    fileName: 'jmdict-eng-common-3.6.2.json', 
    url: 'https://github.com/scriptin/jmdict-simplified/releases/download/3.6.2%2B20260706150322/jmdict-eng-common-3.6.2%2B20260706150322.json.zip',
    isZipArchive: true
  }
];

function downloadFile(url, destinationPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, destinationPath).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download: Status Code ${response.statusCode}`));
      }

      const fileStream = fs.createWriteStream(destinationPath);
      response.pipe(fileStream);
      fileStream.on('finish', () => fileStream.close(resolve));
    }).on('error', (error) => reject(error));
  });
}

async function initializeDataPipeline() {
  try {
    if (!fs.existsSync(RAW_DATA_DIRECTORY)) {
      fs.mkdirSync(RAW_DATA_DIRECTORY, { recursive: true });
    }

    for (const dataset of DATASETS_TO_DOWNLOAD) {
      const targetPath = path.join(RAW_DATA_DIRECTORY, dataset.fileName);
      const temporaryZipPath = path.join(RAW_DATA_DIRECTORY, 'temporary_download.zip');
      
      if (fs.existsSync(targetPath)) {
        console.log(`Dataset ${dataset.fileName} already exists. Skipping.`);
        continue;
      }

      console.log(`Downloading ${dataset.fileName}...`);
      const downloadPath = dataset.isZipArchive ? temporaryZipPath : targetPath;
      
      await downloadFile(dataset.url, downloadPath);

      if (dataset.isZipArchive) {
        console.log(`Extracting ${dataset.fileName} from archive...`);
        const zipArchive = new AdmZip(temporaryZipPath);
        zipArchive.extractEntryTo(dataset.fileName, RAW_DATA_DIRECTORY, false, true);
        fs.unlinkSync(temporaryZipPath); // Clean up the zip file
      }
      
      console.log(`Successfully prepared ${dataset.fileName}`);
    }
  } catch (error) {
    console.error('Data pipeline initialization failed:');
    console.error(error.message);
    process.exit(1); 
  }
}

initializeDataPipeline();

