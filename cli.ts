const inquirer = require('inquirer');
const mongoose = require('mongoose');
const arg = require('arg');
const fse = require('fs-extra');
import Crypto from 'crypto';
import UserService from './services/user';
import UserRepository from './models/user';
import dotenv from 'dotenv';

dotenv.config();

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
    secretProp.key = 'JWT_SECRET';
    secretProp.value = Crypto.randomBytes(48).toString('hex');
    process.env.JWT_SECRET = secretProp.value;
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
    process.env.TITLE = result.title;
    return titleProp;
}

async function promptDbUri() {
    let question = {
        type: 'input',
        name: 'dbUri',
        message: 'Enter database uri:',
        default: 'mongodb://localhost/blog'
    }
    let result = await inquirer.prompt(question)
    let dbUriProp = new EnvProp();
    dbUriProp.key = 'DB_URI';
    dbUriProp.value = result.dbUri;
    process.env.DB_URI = result.dbUri;
    return dbUriProp; 
}

async function promptRegister() {
    const questions = [];

    const requireLetterAndNumber = (value : string) => {
        if (/\w/.test(value) && /\d/.test(value)) {
          return true;
        }
      
        return 'Password needs to use a mixture of letters and numbers.';
    };

    function validateEmail(email : string) {
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regex.test(String(email).toLowerCase())){
            return true;
        }

        return 'Email address is not formatted correctly.'
    }

    questions.push({
        type: 'input',
        name: 'email',
        message: 'Enter an email address:',
        validate: validateEmail
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
        properties.push(property?.key + '=' + "'"+property?.value+"'");
    });

    await fse.ensureFile('.env');

    await fse.writeFile('.env', properties.join('\n'), function(err : Error){
        if (err){
            throw err;
        }
    });
}

async function mongoConnect() {
    if(!process.env.DB_URI){
        throw new Error('No database host specified.');
    }

    mongoose.connect(process.env.DB_URI, {
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
        await promptDbUri(),
        await keygen()
    );

    try {
        await updateEnv(envObj);
    }
    catch(err) {
        console.log(err);
    }

    await register();

    console.log('Initialization complete. Use npm start to run.');
}