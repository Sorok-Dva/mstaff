
# Mstaff Project

## Prerequisites

Install the following software in your computer:

- XCode and command line tools by Apple if you're on MacOs
- [Node.js](https://nodejs.org/en/download/package-manager/) (version 10.4 or higher)
    - NPM
    - N enables the user to switch versions easily (`npm i -g n`)
  

## Run application

Install project dependencies:

```bash
npm install
```

Create local database:

```bash
mysql> CREATE DATABASE mstaff;
```

Run migrations and seeds:

```bash
npm run db:migrate
npm run db:seed
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
