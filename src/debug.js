const chalk = require('chalk');

exports.log = function (msg) {
    console.log(chalk.green.bold('[TeacherBot]') + ' ' + msg);
};