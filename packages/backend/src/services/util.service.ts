class UtilService {
    static generateSalt(): string {
        const max: number = 999999;
        const min: number = 100001;
        const number = Math.floor(Math.random() * (max - min) + min);
        const str: string = (Math.random() + 1).toString(36).substring(7);
        return str.concat(number.toString());
    }
}

export default UtilService;