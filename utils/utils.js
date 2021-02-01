const fs = require('fs');
const { exec } = require('child_process');

const utils = {
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
        if(process && process.env && process.env.PORT){
            return;
        }
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
};
module.exports = utils;

const parseIfObject = (text) => {
    try{
        return JSON.stringify(text);
    } catch(e){
        return text;
    }
}

const gitExec = (err, stdout, stderr) => {
    if (err) {
        utils.writeFile(err);
        // node couldn't execute the command
        return;
      }
    
      // the *entire* stdout and stderr (buffered)
      utils.writeFile(`stdout: ${stdout}`);
      utils.writeFile(`stderr: ${stderr}`);
}