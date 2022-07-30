export class User{
    id:number;
    username:string;
    password:string;
    sex:string;
    city:string;
    repassword:string;

    constructor(username,password){
        this.username = username;
        this.password = password;
    }
}