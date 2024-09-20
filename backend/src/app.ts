import { FastifyInstance } from 'fastify';
import { authMiddleware } from './middlewares/passaport';
import { userRoutes } from './routes/userRoutes';
import { nutritionRoutes } from './routes/nutritionRoutes';
import { authsRoutes } from './routes/authsRoutes'

export async function routes(fastify: FastifyInstance) {

  fastify.register(authsRoutes);

  fastify.register(userRoutes); // Rotas de usuários
  fastify.register(nutritionRoutes); // Rotas de nutrição


}
