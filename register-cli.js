var inquirer = require('inquirer');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('debug', false);
require('./models/users');
const users = mongoose.model('users');

const requireLetterAndNumber = (value) => {
    if (/\w/.test(value) && /\d/.test(value)) {
      return true;
    }
  
    return 'Password needs to have at least a letter and a number';
  };

async function registerPrompt() {
    const questions = [];

    questions.push({
        type: 'input',
        name: 'email',
        message: 'Enter an email address:',
    });

    questions.push({
        type: 'password',
        message: 'Enter a password',
        name: 'password',
        mask: '*',
        validate: requireLetterAndNumber,
    });
    
    return await inquirer.prompt(questions);
}

(async () => {
    let input = await registerPrompt();
    const User = new users(input);
    User.setPassword(input.password);
    return User.save()
        .then(console.log("User registered."));
})();