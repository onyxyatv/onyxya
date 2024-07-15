import axios, { AxiosResponse, HttpStatusCode } from "axios";
import { api_url } from "../../config.json";

class FrontUtilService {
  static token: string | null = localStorage.getItem("onyxyaToken");
  static userEndpoint: string = '/users/user/:id';
  static newUserEndpoint: string = '/users/new';
  static setUserPermissionsEndpoint = '/permissions/setUserPermissions';
  static getMediaByTypeCategories = '/media/:mediaType/byCategories';
  static newPlaylistEndpoint = '/playlists/new';
  static getPlaylists = '/playlists';
  static playlistById = '/playlists/playlist/:id';
  static addMusicPlaylistEndpoint = '/playlists/addMusic';

  // TODO: Need to talk about return any
  public static async getDataFromApi(endpoint: string): Promise<any | null> {
    const authToken: string | null = localStorage.getItem("onyxyaToken");
    try {
      const res: AxiosResponse<any, any> = await axios.get(api_url + endpoint, {
        headers: { "Authorization": `Bearer ${authToken}` }
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
    const authToken: string | null = localStorage.getItem("onyxyaToken");
    try {
      if (!isNaN(userId)) {
        const res: AxiosResponse<any, any> = await axios.get(api_url + "/users/user/" + userId, {
          headers: { "Authorization": `Bearer ${authToken}` }
        });
        if (res.status === HttpStatusCode.Ok) return res.data;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  public static async deleteApi(endpoint: string): Promise<any | null> {
    const authToken: string | null = localStorage.getItem("onyxyaToken");
    try {
      if (endpoint.length > 0) {
        const res: AxiosResponse<any, any> = await axios.delete(api_url + endpoint, {
          headers: { "Authorization": `Bearer ${authToken}` }
        });
        return res;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  public static async patchApi(endpoint: string, body: any): Promise<any | null> {
    const authToken: string | null = localStorage.getItem("onyxyaToken");
    try {
      if (endpoint.length > 0) {
        const res: AxiosResponse<any, any> = await axios.patch(api_url + endpoint,
          body,
          { headers: { "Authorization": `Bearer ${authToken}` } }
        );
        return res;
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  public static async postApi(endpoint: string, body: any): Promise<any | null> {
    const authToken: string | null = localStorage.getItem("onyxyaToken"); 
    try {
      if (endpoint.length > 0) {
        const res: AxiosResponse<any, any> = await axios.post(api_url + endpoint,
          body,
          { headers: { "Authorization": `Bearer ${authToken}` } }
        );
        return res;
      }
      return null;
    } catch (error: any) {
      if (error.response && error.response.data)
        return error.response.data;
      return null;
    }
  }

  /**
   * Capitalize a word
   * @param str | string capitalized
   * @returns | example -> john => John
   */
  public static capitalizeString(str: string): string {
    return str[0].toUpperCase() + str.slice(1);
  }

  public static async fetchMusic(musicId: number): Promise<string | null> {
    const endpoint: string = '/media/getFile/' + musicId;
    const res: Blob = await FrontUtilService.getBlobFromApi(endpoint);
    if (res.size > 0) {
      const url = URL.createObjectURL(res);
      return url;
    }
    return null;
  }
}

export default FrontUtilService;