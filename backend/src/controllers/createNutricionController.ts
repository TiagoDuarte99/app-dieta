import { validationError } from '../errors/validationError';

import {
  FastifyRequest,
  FastifyReply
} from 'fastify'

import { createNutricionService } from '../services/createNutricionService'

export interface DataProps {
  name: string,
  weight: string,
  height: string,
  age: string,
  gender: string,
  objective: string,
  level: string
}

class CreateNutricionController {
  async handle(request: FastifyRequest, reply: FastifyReply) {

    const {
      name,
      weight,
      height,
      age,
      gender,
      objective,
      level
    } = request.body as DataProps;

    if (!name || !weight || !height || !age || !gender || !objective || !level) {
      throw new validationError(
        'Todos os campos são um atributo obrigatório',
      );
    }

    const createNutriction = new createNutricionService();

    const nutricion = await createNutriction.execute({
      name,
      weight,
      height,
      age,
      gender,
      objective,
      level
    });

    reply.send(nutricion)
  }
}

export { CreateNutricionController }