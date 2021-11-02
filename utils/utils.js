const fs = require('fs');
const { exec } = require('child_process');

const utils = {
    writeFile: (text) => {
        console.log(text);
        fs.appendFileSync('logs.txt', '\n' + parseIfObject(text));
    },

    writeAnalisyHight: (text, showLog = true) => {
        showLog ? console.log(text) : undefined;
        fs.appendFileSync('analisyHight.txt', '\n' + parseIfObject(text));
    },
    writeTable: (text, showLog = true) => {
        showLog ? console.log(text) : undefined;
        fs.appendFileSync('table.txt', '\n' + parseIfObject(text));
    },
    writeAnalisyLow: (text) => {
        console.log(text);
        fs.appendFileSync('analisyLow.txt', '\n' + parseIfObject(text));
    },
    
    writeByHold: (text) => {
        console.log(text);
        fs.appendFileSync('byHold.txt', '\n' + parseIfObject(text));
    },
    
    writeStock: (stockName, stockData) => {
        fs.writeFile('./stocks/' + stockName + '.json', parseIfObject(stockData), ()=>{});
    },

    clearFile: () => {
        fs.writeFile('logs.txt', '', ()=>{});
    },

    clearAnalisy: () => {
        fs.writeFile('analisyHight.txt', '', ()=>{});
        fs.writeFile('analisyLow.txt', '', ()=>{});
        fs.writeFile('table.txt', '', ()=>{});
    },

    clearByHold: () => {
        fs.writeFile('byHold.txt', '', () => {});
    },

    gitPush: (callback) => {
        if(process && process.env && process.env.PORT){
            console.log('não vai executar')
            return;
        }
        exec('git add .', (err, stdout, stderr) => {
            err ? console.log(err) : undefined;
            gitExec(err, stdout, stderr);
            exec('git commit -m "new analisy"', (err, stdout, stderr) => {
                err ? console.log(err) : undefined;
                gitExec(err, stdout, stderr);
                exec('git pull', (err, stdout, stderr) => {
                    err ? console.log(err) : undefined;
                    gitExec(err, stdout, stderr);
                    exec('git push', (err, stdout, stderr) => {
                        err ? console.log(err) : undefined;
                        gitExec(err, stdout, stderr);
                        callback ? callback() : undefined;
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
        if(typeof text === Object) return JSON.stringify(text); else return text;
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