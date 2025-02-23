import { UserRepository } from "./UserRepository";

type LoginInput = {
  email: string;
  password: string;
}

type LoginOutput = {
  id: string;
  name: string;
  email: string;
  image: string;
}

export class LoginHandler {
  constructor(private userRepo: UserRepository) {}

  execute(input: LoginInput): LoginOutput | null {
    try {
      const user = this.userRepo.findByEmail(input.email);
      if (user?.passwordHash !== input.password) {
        throw new Error();
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      }
    } catch {
      return null
    }
  }
}