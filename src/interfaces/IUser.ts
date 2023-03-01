export interface IUser {
    _id: string;
    username: string;
    email: string;
    photoURL: string;
    gender: string;
    age: number;
    skills: Array<String>;
    interests: Array<String>;
    latitude: number;
    longitude: number;
}