const net = require('net');
const port = 3000;

function waitForReact() {
  return new Promise((resolve) => {
    const client = new net.Socket();
    
    const tryConnect = () => {
      client.connect({ port }, () => {
        client.end();
        resolve();
      });
    };

    client.on('error', () => {
      setTimeout(tryConnect, 1000);
    });

    tryConnect();
  });
}

waitForReact().then(() => {
  console.log('React pronto! Iniciando Electron...');
  require('child_process').exec('npm run electron');
});