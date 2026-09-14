const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace all font family references
    content = content.replace(/fontFamily: 'Inter-Regular'/g, "fontFamily: 'Poppins-Regular'");
    content = content.replace(/fontFamily: 'Inter-Medium'/g, "fontFamily: 'Poppins-Medium'");
    content = content.replace(/fontFamily: 'Inter-SemiBold'/g, "fontFamily: 'Poppins-SemiBold'");
    content = content.replace(/fontFamily: 'Inter-Bold'/g, "fontFamily: 'Poppins-Bold'");
    
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (err) {
    console.error(`Error processing ${filePath}:`, err);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.tsx')) {
      replaceInFile(filePath);
    }
  });
}

// Start from the app directory
walkDir('./app');
walkDir('./components');