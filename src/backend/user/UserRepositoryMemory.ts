import { User } from "./User"
import { UserRepository } from "./UserRepository";


export class UserRepositoryMemory implements UserRepository {
  private users: User[] = [
    new User("1", "cris", "cris@gmail.com", "123"),
    new User("1", "cris", "cris@gmail.com", "456"),
  ];


  findByEmail(email: string): User | null {
    return this.users.find(user => user.email === email) || null;
  }


}