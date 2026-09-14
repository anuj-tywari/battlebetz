const fs = require('fs');
const path = require('path');
const https = require('https');

const fontUrls = [
  {
    url: 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Regular.ttf',
    filename: 'Poppins-Regular.ttf'
  },
  {
    url: 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Medium.ttf',
    filename: 'Poppins-Medium.ttf'
  },
  {
    url: 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-SemiBold.ttf',
    filename: 'Poppins-SemiBold.ttf'
  },
  {
    url: 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf',
    filename: 'Poppins-Bold.ttf'
  }
];

// Create fonts directory if it doesn't exist
const fontsDir = path.join(__dirname, 'assets', 'fonts');
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Download each font file
fontUrls.forEach(({ url, filename }) => {
  const filePath = path.join(fontsDir, filename);
  const file = fs.createWriteStream(filePath);
  
  console.log(`Downloading ${filename}...`);
  
  https.get(url, (response) => {
    if (response.statusCode !== 200) {
      console.error(`Failed to download ${filename}: HTTP ${response.statusCode}`);
      fs.unlinkSync(filePath); // Remove the file if download failed
      return;
    }
    
    response.pipe(file);
    
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded ${filename} successfully`);
    });
  }).on('error', (err) => {
    fs.unlinkSync(filePath); // Remove the file if download failed
    console.error(`Error downloading ${filename}: ${err.message}`);
  });
});