import axios, { AxiosResponse, HttpStatusCode } from "axios";
import { api_url } from "../../config.json";

class FrontUtilService {
  static token: string | null = localStorage.getItem("onyxyaToken");
  static userEndpoint: string = '/users/user/:id';
  static newUserEndpoint: string = '/users/new';
  static setUserPermissionsEndpoint = '/permissions/setUserPermissions';
  static getMediaByTypeCategories = '/media/:mediaType/byCategories';

  public static async getDataFromApi(endpoint: string): Promise<object | null> {
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

  public static async getBlobFromApi(endpoint: string): Promise<any | null> {
    try {
      const res: AxiosResponse<any, any> = await axios.get(api_url + endpoint, {
        headers: { "Authorization": `Bearer ${this.token}` },
        responseType: 'blob',
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

  public static async deleteApi(endpoint: string): Promise<any | null> {
    try {
      if (endpoint.length > 0) {
        const res: AxiosResponse<any, any> = await axios.delete(api_url + endpoint, {
          headers: { "Authorization": `Bearer ${this.token}` }
        });
        return res;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  public static async patchApi(endpoint: string, body: any): Promise<any | null> {
    try {
      if (endpoint.length > 0) {
        const res: AxiosResponse<any, any> = await axios.patch(api_url + endpoint,
          body,
          { headers: { "Authorization": `Bearer ${this.token}` } }
        );
        return res;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  public static async postApi(endpoint: string, body: any): Promise<any | null> {
    try {
      if (endpoint.length > 0) {
        const res: AxiosResponse<any, any> = await axios.post(api_url + endpoint,
          body,
          { headers: { "Authorization": `Bearer ${this.token}` } }
        );
        return res;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
}

export default FrontUtilService;