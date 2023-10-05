const { exec } = require('child_process');
const path = require('path');

// Define paths to Angular and Node.js projects
const angularPath = path.resolve(__dirname, 'C:/AngularProject/AngularProject/FrontEnd');
const nodePath = path.resolve(__dirname, 'C:/AngularProject/AngularProject/NodeApi');

// Start Angular and Node.js applications concurrently
exec(`concurrently "cd ${angularPath} && ng serve" "cd ${nodePath} && node server.js"`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
