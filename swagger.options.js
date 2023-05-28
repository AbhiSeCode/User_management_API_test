const port = process.env.PORT || 8080;
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User Management API",
      version: "1.0.0",
      description:
        "RESTful APIs that allows users to register, login, and perform basic user management operations",
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          required: ["id", "name", "email"],
          properties: {
            id: {
              type: "string",
              uniqueItems: true,
              description: "Auto-generated id of the user",
            },
            name: {
              type: "string",
              description: "Name of the user",
            },
            email: {
              type: "string",
              uniqueItems: true,
              description: "Email of the user",
            },
          },
        },
        Response: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description:
                "Status of the response will be 1 is successful and 0 when there is an error",
            },
            message: {
              type: "string",
              description: "Message associated with the response",
            },
            data: {
              oneOf: [
                {
                  $ref: "#/components/schemas/User",
                },
                {
                  type: "object",
                  description: "A different data payload schema for other APIs",
                },
              ],
            },
          },
        },
        UserLoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              description: "Email of the user",
            },
            password: {
              type: "string",
              description: "Password of the user associated with email",
            },
          },
          example: {
            email: "testuser@gmail.com",
            password: "testPassword",
          },
        },
        UserRegisterRequest: {
          type: "object",
          required: ["name", "email", "password", "confirm_password"],
          properties: {
            name: {
              type: "string",
              description: "Name of the user",
            },
            email: {
              type: "string",
              description: "Email of the user",
            },
            password: {
              type: "string",
              description: "Password for user account",
            },
            confirm_password: {
              type: "string",
              description:
                "Confirm Password of the user account, need to same as Password",
            },
          },
          example: {
            name: "testUser",
            email: "testuser@gmail.com",
            password: "testPassword",
            confirm_password: "testPassword",
          },
        },
        UserUpdateProfileRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Name of the user",
            },
            email: {
              type: "string",
              description: "Email of the user",
            },
          },
          example: {
            name: "testUser",
            email: "testuser@gmail.com",
          },
        },
      },
      responses: {
        400: {
          description: "Bad Request - Error regarding data sent as request",
          contents: "application/json",
        },
        401: {
          description: "Unauthorized - Provided Credentials are Invalid",
          contents: "application/json",
        },
        404: {
          description: "Not Found - User data requested does not exists",
          contents: "application/json",
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerOptions;
