export class UserToken {
    createdAt = Date.now();

    constructor(public userId: string) {
    }
}