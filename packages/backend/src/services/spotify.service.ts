import { HttpStatus } from "@nestjs/common";
import axios, { AxiosResponse } from "axios";
import { Track } from "src/models/track.model";

class SpotifyService {
  public static spotifyApiVersion: string = "v1";
  public static spotifyApiBase: string = "https://api.spotify.com/" + this.spotifyApiVersion;
  private static clientSecret: string = process.env.SPOTIFY_CLIENT_SECRET;
  private static clientId: string = process.env.SPOTIFY_CLIENT_ID;
  private static apiKey: string | undefined = undefined;
  private static expireDatetime: Date | null = null;

  static async getAccessToken(): Promise<string | null> {
    try {
      const res: AxiosResponse<any, any> = await axios.post("https://accounts.spotify.com/api/token",
        `grant_type=client_credentials&client_id=${this.clientId}&client_secret=${this.clientSecret}`,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      if (res.data.access_token !== undefined) {
        this.apiKey = res.data.access_token;
        this.expireDatetime = new Date(Date.now() + res.data.expires_in * 1000);
      }
    } catch (error) {
      console.log('Error at @getAccessToken :', error);
      return null;
    }
  }

  static async searchTrackByName(searchedName: string): Promise<Array<Track> | null> {
    try {
      await this.checkApiKey();
      if (this.apiKey !== undefined) {
        const res: AxiosResponse<any, any> = await axios.get(`${this.spotifyApiBase}/search?q=${searchedName.replaceAll(' ', '%20')}&type=track`, {
          headers: { "Authorization": `Bearer ${this.apiKey}` }
        });

        if (res.status === HttpStatus.OK) {
          const possibleTracks: Array<Track> = [];
          const items: Array<object> = res.data.tracks.items;
          items.forEach((item: any) => {
            if (item.type === 'track') {
              possibleTracks.push(new Track(
                item.id, item.name, item.album.name, item.preview_url, item.artists[0].name
              ));
            }
          });
          return possibleTracks;
        }
      }

      return null;
    } catch (error) {
      console.log('Error at @getTrackByName :', error);
      return null;
    }
  }

  static async getTrackById(trackId: string): Promise<Track | null> {
    try {
      await this.checkApiKey();
      const res: AxiosResponse<any, any> = await axios.get(`${this.spotifyApiBase}/tracks/${trackId}`, {
        headers: { "Authorization": `Bearer ${this.apiKey}` }
      });

      if (res.status === HttpStatus.OK) {
        const data: any = res.data;
        return new Track(
          data.id, data.name, data.album.name, 
          data.album.images[0].url, data.artists[0].name
        );
      }

      return null;
    } catch (error) {
      console.log('Error at @getTrackById');
      return null;
    }
  }

  private static async checkApiKey() {
    const currentDate: Date = new Date(Date.now());
    if (currentDate >= this.expireDatetime) await this.getAccessToken();
  }
}

export default SpotifyService;