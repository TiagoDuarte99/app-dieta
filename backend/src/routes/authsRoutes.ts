import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply
} from 'fastify'

import { authMiddleware } from '../middlewares/passaport';
import { CreateNutricionController } from '../controllers/createNutricionController'
import { AuthsController } from '../controllers/authsController'


export async function authsRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {

  fastify.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
    return new AuthsController().login(request, reply);
  })

}