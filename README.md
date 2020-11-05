# NodeJS CMS with blog
A CMS developed using NodeJS and MongoDB. It supports blog functionality.

Static pages can be added, along with the ability to append links to the navigation.

## Features
- Json web token authentication
- Edit static pages
- Navigation management
- Markdown(.md) support

## Built with
- Express.js - Web framework
- Mongoose - MongoDB ODM
- Passport - Authentication middleware

## Installation
1. Download the repository and use the `npm install` command to install package dependencies.

2. Use `npm run init` to setup the initial configuration. This will generate a jwt secret key and prompt you for configuring options.

3. While `npm run init` will prompt you to create a user, you can use `npm run register` to create subsequent users, or do so through the admin interface (/admin/register) once authenticated.

4. To log in and access the admin interface in your browser, go to /admin/login.

You can edit the config files manually within the config folder if you choose to do so.

## Planned future features
- Article pagination
- Draft saving and preview
- Password reset via email
- Post archive
- Custom post types