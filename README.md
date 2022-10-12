# e-commerce API

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development.

---

## Prerequisites

You need the following modules and dependencies installed to run this project:

- node # To run the application
- npm # For dependency management

---

## Installing locally on your system

Simply, run the following command to install the project dependencies:

```
$ npm install
```

---

## Setup environment

First, create a .env file with all the required environment variables:

```
- DB_PASSWORD=""
- DB_USERNAME=""
- DB_DATABASE=""
- DB_HOST=""
- SALT_ROUNDS=""
- JWT_SECRET=""
```

---

## Next, start the Postgres

create database:

```
$ create database "name_db";
```

Next, you need to run the database migrations:

```
$ npm run migrate:dev
```

Now, database run on port 5432, and creating users for testing ex:

```
- email: admin@email.com
- password: superadmin
- role: admin,

- email: user@email.com
- password: superuser
- role: user
```

---

## Running the application

Use the following command to run the application in using node:

```
$ npm run start
```

---

The application will run on http://localhost:3001/.

---

## **Built With**

- [**Node.js**](https://nodejs.org/en/about/)
- - [Sequelize](https://www.npmjs.com/package/sequelize)
- - [Express.js](https://www.npmjs.com/package/express)
- [**Visual Studio Code**](https://code.visualstudio.com/)

---
