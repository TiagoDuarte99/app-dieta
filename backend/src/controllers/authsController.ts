import { validationError } from '../errors/validationError';
import { AuthService } from '../services/authsService';
import { FastifyRequest, FastifyReply } from 'fastify'


export interface AuthsData {
  userName: string,
  password: string,
}

class AuthsController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const {
      userName,
      password
    } = request.body as AuthsData;

    if (!userName || !password) {
      throw new validationError(
        'Todos os campos são um atributo obrigatório',
      );
    }

    const { token, userWithoutPassword } = await this.authService.login({ userName, password });

    return reply.send({ payload: userWithoutPassword, token });
  }

}

export { AuthsController }