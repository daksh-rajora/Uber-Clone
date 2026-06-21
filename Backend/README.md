# Backend API Documentation

## `POST /users/register`

### Description
Register a new user account.

This endpoint creates a user with a nested `fullname` object, hashes the password, stores the user in the database, and returns a JSON Web Token for authentication.

### Request URL
`POST /users/register`

### Request Body
Content-Type: `application/json`

```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

### Required Fields
- `fullname.firstname` (string) - minimum 3 characters
- `fullname.lastname` (string) - minimum 3 characters
- `email` (string) - valid email format
- `password` (string) - minimum 6 characters

### Success Response
- Status: `201 Created`
- Example Response Body:
```json
{
  "user": {
    "_id": "6482e0f4b5d3e66a12345678",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Responses
- Status: `400 Bad Request`
  - Validation errors for missing or invalid fields.
  - Example:
```json
{
  "errors": [
    {
      "msg": "Please enter a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

## `POST /users/login`

### Description
Authenticate an existing user and return a JSON Web Token.

This endpoint checks the provided email and password against stored user credentials and returns the authenticated user object plus a JWT.

### Request URL
`POST /users/login`

### Request Body
Content-Type: `application/json`

```json
{
  "email": "john.doe@example.com",
  "password": "secret123"
}
```

### Required Fields
- `email` (string) - valid email format
- `password` (string) - minimum 6 characters

### Success Response
- Status: `200 OK`
- Example Response Body:
```json
{
  "user": {
    "_id": "6482e0f4b5d3e66a12345678",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "socketId": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Responses
- Status: `400 Bad Request`
  - Validation errors for missing or invalid fields.
- Status: `401 Unauthorized`
  - Invalid email or password.
  - Example:
```json
{
  "message": "Invalid email or password"
}
```

### Notes
- Passwords are hashed before being saved.
- The returned `token` is generated using `JWT_SECRET` from environment variables.
