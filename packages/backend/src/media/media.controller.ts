import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../middlewares/auth.guard';
import { MediaService } from './media.service';
import { Request, Response } from 'express';

@UseGuards(AuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get('sync/music')
  async syncMedia(): Promise<object> {
    return this.mediaService.syncMedia();
  }

  @Get('getFile/:fileId')
  async getFile(@Req() req: Request, @Res() res: Response): Promise<void> {
    const fileId: number = Number.parseInt(req.params.fileId);
    const data: { statusCode: number; file: string } =
      await this.mediaService.getFileById(fileId);
    return res.status(data.statusCode).sendFile(data.file);
  }
}
