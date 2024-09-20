import { FastifyRequest, FastifyReply } from 'fastify'
import jwt from 'jsonwebtoken';

import { validationError } from '../errors/validationError';


declare module 'fastify' {
  interface FastifyRequest {
    user?: any; 
  }
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {

    let token = request.headers.token;

    if (!token) {
      throw new validationError('Não autorizado falta token');
    }

    if (Array.isArray(token)) {
      token = token[0];
    }

    try {
      const decoded = jwt.verify(token, process.env.PRIVATE_KEY!);
      request.user = decoded;

      return;
    } catch (err) {
      console.log(err);
      throw new validationError('Token inválido ou expirado');
    }
  } catch (err) {
    console.log(err);
    return reply.status(401).send({ message: err.message, status: err.status });
  }
}
