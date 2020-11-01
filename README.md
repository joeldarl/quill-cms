# Simple NodeJS Blog with a CMS
A simple blog developed using the MVC pattern and MongoDB. Json web tokens are utilized for authentication. Currently the CMS can only be used to manage blog articles and upload images. Page creation is planned.

## Built With
- Express.js - Web framework
- Mongoose - MongoDB ODM
- Passport - Authentication middleware

## Installation
1. Download the repository and use the `npm install` command to install package dependancies.

2. The default MongoDB uri is mongodb://localhost/blog. This can be changed within config.json in the config folder. The blog's title can also be changed here.

3. A **secret key** for json web token authetication needs to be added to the config folder. Rename the secret-template.json file to secret.json and add a key.

4. Create your first admin user with `npm run register`. Subsequent users can be registered through the admin interface (/admin/register).