const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Compass API v1",
    version: "1.0.0",
    description: "API documentation for the Compass book application",
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Development server",
    },
  ],
  tags: [
    {
      name: "Books",
      description: "Operations related to books",
    },
    {
      name: "Users",
      description: "Operations related to users",
    },
    {
      name: "Recommendations",
      description: "Operations related to recommendations",
    },
    {
      name: "Posts",
      description: "Operations related to posts",
    },
  ],
  components: {
    schemas: {
      Book: {
        type: "object",
        properties: {
          id: { type: "integer" },
          title: { type: "string" },
          link: { type: "string" },
          series: { type: "string" },
          cover_link: { type: "string" },
          author: { type: "string" },
          author_link: { type: "string" },
          rating_count: { type: "integer" },
          review_count: { type: "integer" },
          average_rating: { type: "number", format: "float" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer" },
          email: { type: "string" },
          password: { type: "string" },
          name: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          bio: { type: "string" },
          avatar: { type: "string", nullable: true },
        },
      },
      Recommendation: {
        type: "object",
        properties: {
          _id: { type: "string" },
          user_id: { type: "integer" },
          input_book_ids: {
            type: "array",
            items: { type: "integer" },
          },
          output_book_ids: {
            type: "array",
            items: { type: "integer" },
          },
          created_at: { type: "string", format: "date-time" },
        },
      },
      Post: {
        type: "object",
        properties: {
          _id: { type: "string" },
          book_id: { type: "integer" },
          content: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          title: { type: "string" },
          updated_at: { type: "string", format: "date-time" },
          user_id: { type: "integer" },
        },
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: [
    "./source/books/routes.js",
    "./source/posts/routes.js",
    "./source/users/routes.js",
    "./source/recommendations/routes.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(swaggerSpec),
};
