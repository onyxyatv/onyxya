class UtilService {
    static generateSalt(): number {
        const max: number = 99999;
        const min: number = 10000;
        return Math.floor(Math.random() * (max - min) + min);
    }
}

export default UtilService;