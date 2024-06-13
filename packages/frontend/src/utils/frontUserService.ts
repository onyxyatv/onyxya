import axios, { AxiosResponse, HttpStatusCode } from "axios";
import { api_url } from "../../config.json";

class FrontUserService {
  static token: string | null = localStorage.getItem("onyxyaToken");

  public static async getUserById(userId: number): Promise<any | null> {
    try {
      if (!isNaN(userId)) {
        const res: AxiosResponse<any, any> = await axios.get(api_url + "/users/user/" + userId, {
          headers: { "Authorization": `Bearer ${this.token}` }
        });
        console.log(res.data);
        if (res.status === HttpStatusCode.Ok) return res.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

export default FrontUserService;