import { validationError } from '../errors/validationError';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';
import { AuthsData } from '../controllers/authsController';

const expiresIn = '24h';
class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login({ userName, password }: AuthsData) {
    try {
      const user = await this.userService.findUserLogin({ userName });

      if (!user) {
        throw new validationError('Utilizador não encontrado');
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid) {
        throw new validationError('Erro na autenticação');
      }

      const { password: userPassword, ...userWithoutPassword } = user;

      const privateKey = process.env.PRIVATE_KEY!;
      const token = jwt.sign(userWithoutPassword, privateKey, {
        algorithm: 'HS256',
        expiresIn
      });

      return { token, userWithoutPassword };
    } catch (err) {
      throw err;
    }
  }
}

export { AuthService };