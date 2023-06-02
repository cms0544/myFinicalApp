export class User{
    id:number;
    username:string;
    password:string;
    sex:string;
    city:string;
    repassword:string;
    photourl:string;

    constructor(username,password){
        this.username = username;
        this.password = password;
    }
}