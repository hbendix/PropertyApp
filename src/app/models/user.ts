export class UserLocation {
    longitude: number;
    latitude: number;

    constructor(lat, long) {
        this.latitude = lat;
        this.longitude = long;
    }
}

export class User {

    username: string;
    password: string;

    constructor(username: string, password: string) {
        this.password = password;
        this.username = username;
    }
}
