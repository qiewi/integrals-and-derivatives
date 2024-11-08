// replacePlaceholders.js
require('dotenv').config()
const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'InD', 'api', 'config', 'firebaseConfig.js');

let fileContent = fs.readFileSync(filePath, 'utf-8');

// Replace placeholders with environment variables
fileContent = fileContent
  .replace('__API_KEY__', process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
  .replace('__AUTH_DOMAIN__', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)
  .replace('__PROJECT_ID__', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
  .replace('__STORAGE_BUCKET__', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET)
  .replace('__MESSAGING_SENDER_ID__', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID)
  .replace('__APP_ID__', process.env.NEXT_PUBLIC_FIREBASE_APP_ID)
  .replace('__MEASUREMENT_ID__', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID);

fs.writeFileSync(filePath, fileContent, 'utf-8');
console.log('Placeholders in firebaseConfig.js have been replaced with environment variables.');
