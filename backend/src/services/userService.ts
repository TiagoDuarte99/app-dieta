import { validationError } from '../errors/validationError';
import { notFoundError } from '../errors/notFoundError';

import db from '../../db';

class UserService {
  async getUser(filter = {}) {
    try {
      const result = await db('users')
        .where(filter)
        .select([
          'id',
          'userName',
          'name',
          'dateOfBirth',
          'weight',
          'height',
          'gender',
          'objective',
          'created_at',
          'updated_at',
        ])
        .first();
      return result;
    } catch (err) {
      throw err;
    }

  }

  async getAllUsers() {
    try {
      const result = await db('users')
        .select([
          'id',
          'userName',
        ])
      return result;
    } catch (err) {
      throw err;
    }

  }

  async findUserLogin(filter = {}) {
    try {
      const result = await db('users').where(filter).first();

      if (!result) {
        throw new notFoundError('Utilizador nao encontrado',);
      }

      return result;
    } catch (err) {
      throw err;
    }
  }

  async createUser({ userName, passwordHash, name, dateOfBirth, weight, height, gender, objective }) {
    try {
      const user = {
        userName,
        password: passwordHash,
        name,
        dateOfBirth,
        weight,
        height,
        gender,
        objective
      };

      const userInBd = await this.getUser({ userName: user.userName })

      if (userInBd) {
        throw new validationError(
          'Já existe um utilizador com esse username',
        );
      }

      const [userId] = await db('users').insert(user).returning('id');

      return { data: { id: userId, ...user } };
    } catch (err) {
      throw err;
    }
  }

  async updateUser(id: string, updatedData: {}) {
    try {
      const user = await this.getUser({ id });

      if (!user) {
        throw new notFoundError('Utilizador nao encontrado');
      }

      if (updatedData.hasOwnProperty('userName')) {
        const userName = updatedData['userName']
        const userByName = await this.getUser({ userName });

        if (userByName) {
          throw new validationError(
            'Nome de usuário já está em uso.',
          );
        }
      }

      const userUpdate = await db('users')
        .where({ id })
        .update(updatedData)
        .returning(['id', 'userName', 'name', 'dateOfBirth', 'weight', 'height', 'gender', 'objective', 'created_at', 'updated_at']);

      return { data: userUpdate[0] };

    } catch (err) {
      throw err;
    }

  }

  async deteleUser({ id }) {
    try {
      const user = await this.getUser({ id });

      if (!user) {
        throw new notFoundError('Utilizador nao encontrado',);
      }

      const userDeleted = await db('users')
        .where({ id })
        .del();

      return userDeleted;

    } catch (err) {
      throw err;
    }

  }
}

export { UserService }