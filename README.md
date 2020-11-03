# Simple NodeJS Blog with a CMS
A simple blog developed using MVC and MongoDB. Json web tokens are utilized for authentication.

Articles are saved and edited in markdown (.md) and are converted to html when served in the browser!

Static pages can be added, along with the ability to append links to the navigation.

## Built with
- Express.js - Web framework
- Mongoose - MongoDB ODM
- Passport - Authentication middleware

## Installation
1. Download the repository and use the `npm install` command to install package dependancies.

2. Use `npm run init` to setup the initial configuration. This will generate a jwt secret key and prompt you for configuring options.

3. While `npm run init` will prompt you to create an initial user, you can use `npm run register` to create subsequent users, or do so through the admin interface (/admin/register) once authenticated.

4. To log in and access the admin interface in your browser, go to /admin/login.

You can edit the config files manually within the config folder if you choose to do so.

## Plans for future updates

Article pagination and archive functionality will be added. At some point, custom post types will probably be added to replace articles.