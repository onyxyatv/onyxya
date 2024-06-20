import axios, { AxiosResponse, HttpStatusCode } from "axios";
import { api_url } from "../../config.json";

class FrontUtilService {
  static token: string | null = localStorage.getItem("onyxyaToken");

  public static async getDataFromApi(endpoint: string): Promise<any | null> {
    try {
        const res: AxiosResponse<any, any> = await axios.get(api_url + endpoint, {
          headers: { "Authorization": `Bearer ${this.token}` }
        });
        if (res.status === HttpStatusCode.Ok) return res.data;
      return null;
    } catch (error) {
      return null;
    }
  }

  public static async getUserById(userId: number): Promise<any | null> {
    try {
      if (!isNaN(userId)) {
        const res: AxiosResponse<any, any> = await axios.get(api_url + "/users/user/" + userId, {
          headers: { "Authorization": `Bearer ${this.token}` }
        });
        if (res.status === HttpStatusCode.Ok) return res.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

export default FrontUtilService;