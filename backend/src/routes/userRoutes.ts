import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply
} from 'fastify'

import { authMiddleware } from '../middlewares/passaport';
import { UserController } from '../controllers/userController'


export async function userRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  const userController = new UserController();

  fastify.post("/creatUser", async (request: FastifyRequest, reply: FastifyReply) => {
    return userController.createUserController(request, reply);
  })

  fastify.get("/findOneUser", async (request: FastifyRequest, reply: FastifyReply) => {  
    return userController.getUser(request, reply);
  });

  fastify.get("/findUsers", async (request: FastifyRequest, reply: FastifyReply) => {  
    return userController.getAllUsers(request, reply);
  });

  fastify.patch("/updateUser/:id", { preHandler: authMiddleware },  async (request: FastifyRequest, reply: FastifyReply) => {
    const userAuths = request.user 
    return userController.updateUserController(request, reply, userAuths);
  })

  fastify.delete("/deleteUser/:id", { preHandler: authMiddleware },  async (request: FastifyRequest, reply: FastifyReply) => {
    const userAuths = request.user 
    return userController.deleteUserController(request, reply, userAuths);
  })

}