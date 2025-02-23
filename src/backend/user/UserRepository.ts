import { User } from "./User";

export interface UserRepository {
  findByEmail(email: string): User | null;
}
