const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Create scripts directory if it doesn't exist
const buildDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Create a file to stream archive data to
const output = fs.createWriteStream(path.join(buildDir, 'chrome-extension.zip'));
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level
});

// Listen for all archive data to be written
output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('Chrome extension has been packaged as chrome-extension.zip');
});

// Good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    console.warn(err);
  } else {
    throw err;
  }
});

// Good practice to catch this error explicitly
archive.on('error', function(err) {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Append files from chrome-extension directory
const extensionDir = path.join(__dirname, '..', 'chrome-extension');
archive.directory(extensionDir, false);

// Finalize the archive
archive.finalize(); 