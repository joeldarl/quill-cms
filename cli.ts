const inquirer = require('inquirer');
const mongoose = require('mongoose');
const arg = require('arg');
const fse = require('fs-extra');
import Crypto from 'crypto';
import UserService from './services/user';
import UserRepository from './models/user';

require('dotenv').config();

const userService = new UserService(new UserRepository());
class EnvProp {
    public key : string;
    public value : string;
}
class EnvObject {
    constructor(){
        this.arrayObject = [];
    };

    public arrayObject : Array<EnvProp | null>;

    public getPropertyArray(){
        return 
    }
}

// Arguments
const args = arg({
    // Types
    '--help':     Boolean,
    '--version':  Boolean,
    '--register': Boolean,
    '--init':     Boolean,
 
    // Aliases
    '-r':         '--register',
    '-i':         '--init',
});

for (var i = 0; i < Object.keys(args).length; i++) {
    var argStr = Object.keys(args)[i];
    switch(argStr) {
        case '--register':
            register();
            break;
        case '--init':
            initialize();
            break;
    }
}

async function keygen() {
    let secretProp = new EnvProp();
    secretProp.key = 'SECRET';
    secretProp.value = Crypto.randomBytes(48).toString('hex');
    return secretProp;
}

async function promptTitle() {
    let question = {
        type: 'input',
        name: 'title',
        message: 'Enter a title:',
        default: 'Blog'
    }
    let result = await inquirer.prompt(question)
    let titleProp = new EnvProp();
    titleProp.key = 'TITLE';
    titleProp.value = result.title;
    return titleProp;
}

async function promptDbHost() {
    let question = {
        type: 'input',
        name: 'dbHost',
        message: 'Enter database host:',
        default: 'mongodb://localhost/blog'
    }
    let result = await inquirer.prompt(question)
    let dbHostProp = new EnvProp();
    dbHostProp.key = 'TITLE';
    dbHostProp.value = result.dbHost;
    return dbHostProp; 
}

async function promptDbUser() {
    let question = {
        type: 'input',
        name: 'dbHost',
        message: 'Enter database user:',
        default: null
    }
    let result = await inquirer.prompt(question)
    if(result.dbHost = null) {
        return null;
    }
    else {
        let dbHostProp = new EnvProp();
        dbHostProp.key = 'DB_HOST';
        dbHostProp.value = result.dbHost;
        return dbHostProp;
    }
}

async function promptDbPassword() {
    let question = {
        type: 'input',
        name: 'dbPassword',
        message: 'Enter database password:',
        default: null
    }
    let result = await inquirer.prompt(question)
    if(result.dbPassword = null) {
        return null;
    }
    else {
        let dbPassword = new EnvProp();
        dbPassword.key = 'DB_PASSWORD';
        dbPassword.value = result.dbPassword;
        return dbPassword;
    }
}

async function promptRegister() {
    const questions = [];

    const requireLetterAndNumber = (value : string) => {
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

async function register() {
    console.log("Creating a new user...");

    try {
        mongoConnect();
    }
    catch (err)
    {
        console.log(err);
    }

    let result = await promptRegister();

    let user : any = {
        email : result.email,
        password : result.password
    };

    try {
        await userService.createUser(user);
        return console.log("User registered.");
    }
    catch (err) {
        console.log(err);
        return;
    }
    finally {
        mongoose.connection.close();
    }
};

async function updateEnv(envObject : EnvObject) {
    let properties : Array<string> = [];

    envObject.arrayObject.forEach(property => {
        properties.push(property?.key + '=' + property?.value);
    });

    await fse.writeFile('./test.env', properties.join('\n'), function(err : Error){
        if (err){
            throw err;
        }
    });
}

async function mongoConnect() {
    if(!process.env.DB_HOST){
        throw new Error('No database host specified.');
    }

    mongoose.connect(process.env.DB_HOST, {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true
    });
    mongoose.set('debug', false);
    mongoose.Promise = global.Promise;
}

//Initial set up
async function initialize() {
    let envObj : EnvObject = new EnvObject();

    envObj.arrayObject.push(
        await promptTitle(), 
        await promptDbHost(),
        await promptDbUser(),
        await promptDbPassword(),
        await keygen()
    );

    await register();

    try {
        await updateEnv(envObj);
    }
    catch(err) {
        console.log(err);
    }

    console.log('Initialization complete. Use npm start to run.');
}