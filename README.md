# Quill CMS
A publishing CMS developed using NodeJS, TypeScript and MongoDB. This project is in ongoing development!

## Features
- Json web token authentication
- Create static pages
- Markdown(.md) support

## Installation
1. Download the repository and use the `npm install` command to install package dependencies.

2. Make sure you have a MongoDB server running! (https://docs.mongodb.com/manual/administration/install-community/)

3. Use `npm run init` to setup the initial configuration. This will generate a jwt secret key and prompt you for configuring options.

4. While `npm run init` will prompt you to create a user, you can use `npm run register` to create subsequent users, or do so through the admin interface (/admin/users/register) once authenticated.

5. To log in and access the admin panel in your browser, go to /admin/users/login.

## Planned future features
- Draft saving and preview
- Password reset via email
- Custom themes
- SQLite support