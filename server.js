const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Esquema GraphQL
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// Resolvers (cómo responder a las consultas)
const root = {
  hello: () => 'Hola Mundo desde GraphQL',
};

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'GraphQL API with Swagger',
      version: '1.0.0',
      description: 'A simple GraphQL API with Swagger documentation',
    },
    servers: [
      {
        url: 'http://localhost:4000/graphql',
        description: 'GraphQL Server',
      },
    ],
  },
  apis: ['./server.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Crear aplicación Express
const app = express();

// Rutas de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /graphql:
 *   get:
 *     summary: Interactuar con GraphQL API
 *     description: Utiliza GraphQL para consultar "Hola Mundo".
 *     responses:
 *       200:
 *         description: GraphQL response
 */
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Habilita GraphiQL para probar en el navegador
  })
);

// Iniciar servidor
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Documentación en http://localhost:${PORT}/api-docs`);
});
