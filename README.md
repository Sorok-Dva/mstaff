[![BCH compliance](https://bettercodehub.com/edge/badge/Sorok-Dva/mstaff?branch=master&token=fcae151b6fb34e81aeffa0ddbfd48cc194e3bada)](https://bettercodehub.com/)

# Mstaff Project

## Prerequisites

Install the following software in your computer:

- XCode and command line tools by Apple if you're on MacOs
- Node.js (version 10.4 or higher) (`sudo n stable`)
    - NPM
    - N enables the user to switch versions easily (`npm i -g n`)
    - gulp (tasks manager) (`npm i -g gulp`)
  

## Run application

Install project dependencies:

```bash
npm install
```

Create .env file:

```bash
touch .env
```

Env var:
```
SECRET=
SITE_TITLE=Mstaff
URL=localhost
PORT=3001
ENV=development
DOMAIN=localhost
GMAIL_EMAIL=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
GMAIL_ACCESS_TOKEN=
SENTRY_DNS=
```

Create local database:

```bash
mysql> CREATE DATABASE mstaff;
```

Recreate development database:

`DROP all mstaff_developement tables`

```bash
npm run db:migrate;
```
`Execute EstablishmentReferencesINSERTseeds.sql (/sql/) on database`
```bash
npm run db:seed;
```
Run migrations and seeds:

```bash
npm run db:migrate
npm run db:seed
```

Run migrations or seeds in specific db:

```bash
npm run db:migrate -- --env test
npm run db:seed -- --env e2e
```

Build and run local server:

```bash
npm start       
```

Run test :
```bash
curl http://localhost:3001/api/
```
It should read `{"message":"welcome"}`

## ORM Commands

Create new model (exemple) :  
```bash
node_modules/.bin/sequelize model:generate --name TableName --attributes column1:integer,column2:string,column3:date
``` 

Create new seed :  
```bash
node_modules/.bin/sequelize seed:generate --name seed-name
``` 

Execute seed file alone :  
```bash
cd orm/
sequelize db:seed --seed [seed filename]
``` 

## Some useful documentations

- [Express.js (4.x)](http://expressjs.com/fr/api.html)
- [Sequelize Model Definition](http://docs.sequelizejs.com/manual/tutorial/models-definition.html)
- [Sequelize Model Usage](http://docs.sequelizejs.com/manual/tutorial/models-usage.html)
- [Sequelize Querying](http://docs.sequelizejs.com/manual/tutorial/querying.html)
- [Handlebars](https://handlebarsjs.com/)
- [Jquery](https://api.jquery.com/)
- [Lodash](https://lodash.com/docs/4.17.11)
