// @/backend/user/User.ts
export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public passwordHash?: string,
    public image: string = ""
  ) {}
}