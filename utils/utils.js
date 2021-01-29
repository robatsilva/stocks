const fs = require('fs');
const { exec } = require('child_process');
module.exports = {
    writeFile: (text) => {
        console.log(text);
        fs.appendFileSync('logs.txt', '\n' + parseIfObject(text), function (err) {
            if (err) return writeFile(err);
          });
    },
    
    writeStock: (stockName, stockData) => {
        fs.writeFile('./stocks/' + stockName + '.json', parseIfObject(stockData), function (err) {
            if (err) return writeFile(err);
          });
    },

    clearFile: () => {
        fs.writeFile('logs.txt', '', function (err) {
            if (err) return writeFile(err);
          });
    },

    gitPush: () => {
        exec('git add .', (err, stdout, stderr) => {
            gitExec(err, stdout, stderr);
            exec('git commit -m "new analisy"', (err, stdout, stderr) => {
                gitExec(err, stdout, stderr);
                exec('git pull', (err, stdout, stderr) => {
                    gitExec(err, stdout, stderr);
                    exec('git push', (err, stdout, stderr) => {
                        gitExec(err, stdout, stderr);
                    });
                });
            });
        });
    },
    
    sleep: (milliseconds) => {
        const date = Date.now();
        let currentDate = null;
        do {
          currentDate = Date.now();
        } while (currentDate - date < milliseconds);
      }
}

const parseIfObject = (text) => {
    try{
        return JSON.stringify(text);
    } catch(e){
        return text;
    }
}

const gitExec = (err, stdout, stderr) => {
    if (err) {
        // node couldn't execute the command
        return;
      }
    
      // the *entire* stdout and stderr (buffered)
      module.export.writeFile(`stdout: ${stdout}`);
      module.export.writeFile(`stderr: ${stderr}`);
}