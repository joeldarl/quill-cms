const inquirer = require('inquirer');
const mongoose = require('mongoose');
const arg = require('arg');
const fse = require('fs-extra');
const crypto = require('crypto');

(async () => {
    
})();

// Arguments
const args = arg({
    // Types
    '--help':     Boolean,
    '--version':  Boolean,
    '--register': Boolean,
    '--keygen':   Boolean,
    '--init':     Boolean,
    '--config':   Boolean,
 
    // Aliases
    '-r':         '--register',   
    '-k':         '--keygen',
    '-i':         '--init',
});

for (var i = 0; i < Object.keys(args).length; i++) {
    var argStr = Object.keys(args)[i];
    switch(argStr) {
        case '--register':
            register();
            break;
        case '--keygen':
            keygen();
            break;
        case '--title':
            setTitle();
            break;
        case '--init':
            initialize();
            break;
        case '--config':
            config();
            break;
    }
}

//Keygen
async function keygen() {
    let secretKeyPath = './config/secret.json';
    let secretKeyTemplatePath = './config/secret-template.json';

    await fse.ensureFile(secretKeyPath);
    let secret = {};
    secret.secret = crypto.randomBytes(48).toString('hex');
    secret = JSON.stringify(secret, null, 2);

    await fse.writeFile(secretKeyPath, secret, function(err){
        if (err){
            console.log(err);
        }
    });

    return console.log('Secret key for jwt has been generated and saved.');
}

//Set config
async function config() {
    console.log("Setting up config...");

    let configPath = './config/config.json';
    let configTemplatePath = './config/config-template.json';

    await fse.ensureFile(configPath);

    let input = await configPrompt();
    let config = {};
    config.title = input.title;
    config.databaseUri = input.databaseUri;
    config = JSON.stringify(config, null, 2);

    await fse.writeFile(configPath, config, function(err){
        if (err){
            console.log(err);
        }
    });

    return console.log('Config set.');
}

async function configPrompt() {
    const questions = [];

    questions.push({
        type: 'input',
        name: 'title',
        message: 'Enter the title of the blog:',
        default: 'Blog Title'
    });

    questions.push({
        type: 'input',
        name: 'databaseUri',
        message: 'Enter database uri:',
        default: 'mongodb://localhost/blog'
    })
    
    return await inquirer.prompt(questions);
}

//Register
async function register() {
    console.log("Creating a new user...");

    let config;

    try {
        config = await fse.readJson('./config/config.json');
    }
    catch (err) {
        console.log(err);
    }

    if(!config.databaseUri) return console.log('No database configuration found, please use npm run init.');

    mongoose.connect(config.databaseUri, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.set('debug', false);
    require('./models/users');
    const users = mongoose.model('users');

    let input = await registerPrompt();
    const User = new users(input);
    User.setPassword(input.password);
    await User.save();

    mongoose.connection.close()
    return console.log("User registered.");
};

async function registerPrompt() {
    const questions = [];

    const requireLetterAndNumber = (value) => {
        if (/\w/.test(value) && /\d/.test(value)) {
          return true;
        }
      
        return 'Password needs to have at least a letter and a number';
    };

    questions.push({
        type: 'input',
        name: 'email',
        message: 'Enter an email address:',
    });

    questions.push({
        type: 'password',
        message: 'Enter a password:',
        name: 'password',
        mask: '*',
        validate: requireLetterAndNumber,
    });
    
    return await inquirer.prompt(questions);
}

//Init to be used for initial set up
async function initialize() {
    await keygen();
    await config();
    await register();
    console.log('Initialization complete. Use npm start.')
}