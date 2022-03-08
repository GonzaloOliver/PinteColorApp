import { IAuth } from "../interfaces/auth.interface";

export class Auth implements IAuth{
    username: string;
    password: string;
    
    constructor(){
        this.username = '',
        this.password = ''
    }
}