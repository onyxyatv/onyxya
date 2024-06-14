export class Track {
  constructor(id: string, name: string, albumName: string, image: string, artistName: string) {
    this.id = id;
    this.name = name;
    this.albumName = albumName;
    this.image = image;
    this.artistName = artistName;
  }

  public id: string;
  public name: string;
  public albumName: string;
  public image: string;
  public artistName: string;

}