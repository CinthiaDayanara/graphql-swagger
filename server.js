const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

// Crear esquema de GraphQL
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Resolver de GraphQL
const root = {
  hello: () => 'Hola Mundo desde GraphQL',
};

// Configurar GraphQL con Express
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'GraphQL API',
      version: '1.0.0',
      description: 'API GraphQL integrada con Swagger',
    },
  },
  apis: ['server.js'], // Ruta del archivo donde documentas tus endpoints
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /graphql:
 *   post:
 *     summary: Ejecutar consultas GraphQL
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 description: La consulta GraphQL
 *                 example: "{ hello }"
 *     responses:
 *       200:
 *         description: Respuesta de GraphQL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
app.post('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
}));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}/graphql`);
  console.log(`Documentación Swagger en http://localhost:${PORT}/api-docs`);
});
