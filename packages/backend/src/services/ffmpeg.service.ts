import * as ffmpeg from 'fluent-ffmpeg';

class FfmepgService {
  static command = ffmpeg();

  public static test() {
    console.log(this.command);
  }
}

export default FfmepgService;
