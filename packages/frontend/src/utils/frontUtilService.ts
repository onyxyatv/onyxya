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

  public static formatDate(date: Date): string {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();
  
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
  
    return [year, month, day].join("-");
  }

  public static formatEuDate(date: Date | string) {
    const formated: string = FrontUtilService.formatDate(new Date(date));
    const splited: Array<string> = formated.split('-');
    const final = splited[1] + '/' + splited[2] + '/' + splited[0];
    return final;
  }
}

export default FrontUtilService;