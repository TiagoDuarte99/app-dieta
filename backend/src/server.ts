import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { routes } from "./app";

const app = Fastify({ logger: true })
dotenv.config();

app.setErrorHandler((error, request, reply) => {
  const { name, message, stack } = error;

  switch (name) {
    case 'validationError':
      reply.status(400).send({ error: message });
      break;
    case 'forbiddenError':
      reply.status(403).send({ error: message });
      break;
    case 'notFoundError':
      reply.status(404).send({ error: message });
      break;
    default:
      reply.status(500).send({ name, message, stack });
  }
})

const start = async () => {
  app.register(cors);
  app.register(routes);

  try {
    const port = Number(process.env.NODE_PORT) || 3333; 
    await app.listen({ port, host: "0.0.0.0" });
    console.log(`listening on port: http://localhost:${port}`);
  } catch (err) {
    console.error('Error starting the server:', err);
  }
}

start();