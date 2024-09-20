import { validationError } from '../errors/validationError';
import { forbiddenError } from '../errors/forbiddenError';
import { notFoundError } from '../errors/notFoundError';

import * as bcrypt from 'bcryptjs';
import { UserService } from '../services/userService'

import {
  FastifyRequest,
  FastifyReply
} from 'fastify'


export interface UserData {
  userName: string,
  password: string,
  name: string,
  dateOfBirth: Date,
  weight: string,
  height: string,
  gender: string,
  objective: string,
  confirmPassword: string
}

function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

const getPasswdHash = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService();
  }

  async getUser(request: FastifyRequest, reply: FastifyReply) {
    const filter = request.query!;
    try {
      const user = await this.userService.getUser(filter);
      if (!user) {
        throw new notFoundError('Utilizador nao encontrado');
      }

      return reply.send(user);
    } catch (err) {
      throw err;
    }
  }

  async getAllUsers(request: FastifyRequest, reply: FastifyReply) {
    try {
      const user = await this.userService.getAllUsers();
      if (!user) {
        throw new notFoundError('Utilizador nao encontrado');
      }

      return reply.send(user);
    } catch (err) {
      throw err;
    }
  }

  async createUserController(request: FastifyRequest, reply: FastifyReply) {
    try {
      const {
        userName,
        password,
        name,
        dateOfBirth,
        weight,
        height,
        gender,
        objective,
        confirmPassword
      } = request.body as UserData;

      if (!userName || !password || !name || !weight || !height || !dateOfBirth || !gender || !objective || !confirmPassword) {
        throw new validationError(
          'Todos os campos são um atributo obrigatório',
        );
      }

      if (!isValidPassword(password)) {
        throw new validationError('A password deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um dígito e um caractere especial');
      }
      if (password !== confirmPassword) {
        throw new validationError('A password não corresponde à confirmação de password.');
      }

      const passwordHash = getPasswdHash(password)

      const user = await this.userService.createUser({
        userName,
        passwordHash,
        name,
        dateOfBirth,
        weight,
        height,
        gender,
        objective,
      });

      reply.send({ user, message: 'Utilizador criado com sucesso' })
    } catch (err) {
      throw err;
    }
  }

  async updateUserController(request: FastifyRequest, reply: FastifyReply, userAuths: any) {
    try {
      const { id } = request.params as { id: string };

      const {
        userName,
        password,
        name,
        dateOfBirth,
        weight,
        height,
        gender,
        objective,
        confirmPassword
      } = request.body as Partial<UserData>;

      if (userAuths.id.toString() !== id) {
        throw new forbiddenError('Não tem autorização para editar este utilizador.');
      }

      let passwordHash: any;
      if (password) {
        if (!isValidPassword(password)) {
          throw new validationError('A senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um dígito e um caractere especial');
        }
        passwordHash = getPasswdHash(password);
      }

      if (password && confirmPassword && password !== confirmPassword) {
        throw new validationError('A senha não corresponde à confirmação de senha.');
      }


      const updatedData = {
        ...(userName && { userName }),
        ...(passwordHash && { password: passwordHash }),
        ...(name && { name }),
        ...(dateOfBirth && { dateOfBirth }),
        ...(weight && { weight }),
        ...(height && { height }),
        ...(gender && { gender }),
        ...(objective && { objective }),
        updated_at: new Date()
      };

      const updatedUser = await this.userService.updateUser(id, updatedData);

      reply.send({ updatedUser, message: 'Utilizador Atualizado com sucesso' })
    } catch (err) {
      throw err;
    }
  }

  async deleteUserController(request: FastifyRequest, reply: FastifyReply, userAuths: any) {
    const { id } = request.params as { id: string };
    try {

      console.log(id, userAuths.id.toString())
      if (userAuths.id.toString() !== id) {
        throw new forbiddenError('Não tem autorização para eliminar este utilizador.');
      }

      const userDeleted = await this.userService.deteleUser({ id });

      if (userDeleted) {
        reply.send('Utilizador eliminado com sucesso')
      }
    } catch (err) {
      throw err;
    }
  }
}

export { UserController }