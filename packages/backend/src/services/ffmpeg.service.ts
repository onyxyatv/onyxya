import * as ffmpeg from 'fluent-ffmpeg';
import UtilService from './util.service';

class FfmepgService {
  static command = ffmpeg();

  public static async convertMp4ToMp3(filePath: string): Promise<void> {
    this.command
      .input(filePath)
      .format('mp3')
      .output('/home/node/media/music/test.mp3')
      .on('end', async () => {
        console.log('Conversion finished');
      })
      .on('error', (err) => {
        console.error('Error:', err);
      })
      .run();
  }

  public static createStream(filePath: string): Promise<string> {
    const randomValue = UtilService.generateSalt();
    const outputFile = 'output-' + randomValue + '.m3u8';
    return new Promise((resolve, reject) => {
      ffmpeg(filePath, { timeout: 432000 })
        .addOption([
          '-codec: copy', // We want to copy with the same video codec
          '-level 3.0',
          '-start_number 0', // start the first .ts segment at index 0
          '-hls_time 10', // Segment duration
          '-hls_list_size 0', // Maximum number of segments, set 0 to set no limit
          '-f hls', // We use HTTP Live streaming
        ])
        .output(`/home/node/media/output/${outputFile}`)
        .on('error', (err) => {
          console.log('An error occurred: ' + err);
          reject(err);
        })
        .on('end', () => resolve(outputFile))
        .run();
    });
  }

  public static async getAudioFileInformations(
    filePath: string,
  ): Promise<ffmpeg.FfprobeData> {
    const getInformations = () => {
      return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (error, metadata) => {
          if (error) reject(null);
          resolve(metadata);
        });
      });
    };

    const data: any = await getInformations();
    return data;
  }
}

export default FfmepgService;
