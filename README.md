# Coin-Coach-Endpoint
An API for the Coin Coach app which is a web-based app for learning about cryptocurrencies.

It is a part of a capstone project, a necessary part of the Women Techsters Fellowship 2022/2023, organized by [Tech4Dev](https://www.tech4dev.org/). It was developed by a team of product managers, designers, data scientists, frontend and backend developers, and cybersecurity and blockchain engineers. As the backend developer, I gained valuable experience in NodeJS, Express, MySQL, and Sequelize. 

![The Design](./assets/Screenshot%20(70).png)

## Table of Contents

- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Database Setup](#database-setup)
- [Usage](#usage)
  - [Endpoints](#endpoints)
    - [Auth Routes](#auth-routes)
    - [More Routes](#more-routes)
  - [Authentication](#authentication)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact Information](#contact-information)

## Getting Started

The project is being edited as I felt I had gained a bit more knowledge that had to be applied and it was more appropriate to provide a detailed markdown for it.

This is a Node.js application using Express framework, MySQL as database, and JWT (JSON Web Token) for authentication.

### Installation

Explain the installation process, including dependencies and any necessary commands.

I am using a lot of dependencies in this project:
1. [ExpressJS](http://expressjs.com/) as my server framework.
2. [Cors](https://github.com/expressjs/cors#readme) to handle Cross-Origin Resource Sharing (CORS).
3. [MySQL](https://sidorares.github.io/node-mysql2/docs) to store all data related to users, coins, articles etc.
4. [Sequelize ORM](https://sequelize.org/) (Object Related Mapping) to interact with the database.
5. [Bcryptjs](https://github.com/dcodeIO/bcrypt.js#readme) for hashing passwords.
6. [Jsonwebtoken](https://github.com/auth0/node-jsonwebtoken#readme) for handling JWTs.
7. [Dotenv](https://github.com/motdotla/dotenv#readme) for environment variables.
8. [Nodemailer](https://nodemailer.com/) for sending emails.
9. [Otp-generator](https://github.com/Maheshkumar-Kakade/otp-generator#readme) for generating OTPs.
10. [Body-parser](https://github.com/expressjs/body-parser#readme) to parse JSON bodies from requests.

To install these dependencies I used npm package manager by running this command in my terminal:

```bash
npm install
```

### Configuration
Since I am using dotenv dependency, to access the `.env` file (which is git ignored) at the root directory. I configured the dependency and used `process.env.variable_name` to access the variables.

Below is the description of variables in the .env file: 
- `HOST`: The host name of my MySQL Server.
- `USER`: The username on the MySQL Server.
- `PASSWORD`: Password associated with my username on the MySQL Server.
- `DB_NAME`: Name of the database I used.
- `PORT`: Port number that the application runs on.
- `JWT_SECRET`: Secret key for signing JsonWebToken.
- `USER_E`: Email address for sending and receiving mails.
- `E_PASS`: Password for the email account.

### Database Setup
To set up the database, I created an empty database manually on  MySql Workbench and then connected it using sequelize as detailed in the [connections.js](./config/connections.js) file.

## Usage
This project is a token based API and is set up in a request - response format. The existing endpoints details would be provided below and more would be added as soon as they are done.

### Endpoints
The API provides the following endpoints:

#### Auth Routes
`POST /api/auth/signup` - Register a new user.

Request body should contain:

```json
{
    "userEmail": "String",
    "password": "String", // A minimum of 8 characters  containing at least one uppercase letter, one lowercase letter, one digit and one special character.
    "confirmPassword": "String", // Must be same as password.
    "newsletter": "Boolean", //optional.
    "terms": "Boolean"
}
```

Response will be:
```json
{
    "message": "Success",
    "token": "Signed JWT token", //this expires in an  hour
    "email": "User's email"
}
```

---

`POST /api/auth/signin` - Logs in an existing user.

Request body should contain:

```json
{
    "userEmail": "String",
    "password": "String",
    "signedIn": "Boolean" // optional
}
```

Response will be:
```json
{
    "message": "Success",
    "token" : "Signed JWT token" // if signedIn is true, this expires in 60 days else it expires in a day.
}
```

---

`POST /api/auth/forgot-password` - Sends reset password otp to the provided email address.

Request body should contain:

```json
{
    "userEmail": "String"
}
```

Response will be:
```json
{
    "message": "Success",
    "token" : "Signed JWT token", // expires in an hour.
    "otp": "Number" // will remove soon.
}
```

---

`POST /api/auth/verify-otp` -  Verifies the OTP sent by `forgot-password` and `signup`. This is an  authorized route so token from the necessary route should be attached to the authorization header.

Request body should contain:

```json
{
    "otp": "Number"
}
```

Response will be:
```json
{
    "message": "Success",
    "token" : "Signed JWT token" // expires in an hour.
}
```

---

`POST /api/auth/resend-otp` -  Resends OTP to the user's email. It is an authorized route so token from header must be provided

No request body.

Response will be:
```json
{
    "message": "Success",
    "otp" : "Number" // I will remove soon.
}
```

---

`PUT /api/auth/reset-password` - Resets user's password. This is an authorized route.

Request body should contain:

```json
{
    "password": "String", // same rules apply as for signup route.
    "confirmPassword": "String" // must match password.
}
```

Response will be:
```json
{
    "message": "Success"
}
```

---

#### More Routes
Coming soon.

### Authentication
All upcoming routes that require authentication will be identified with comments or `// auth` and they need tokens. To get a token, a POST request has to be made to `/api/auth/login` for login token which lasts longer than tokens generated from other authorization routes.

## Testing
I tested all routes on Postman and Thunder Client. All of them are working correctly.

## Contributing
Pull requests are welcome.

## License
ISC

## Contact Information
If you have any questions or suggestions, please feel free to contact me via email at [gracenwafor50@gmail.com](mailto:gracenwafor50@gmail.com)