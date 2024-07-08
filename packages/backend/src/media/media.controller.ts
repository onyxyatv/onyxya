import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { basename, extname } from 'path';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { NeedPermissions } from 'src/permissions/permissions.decorator';
import { MediaService } from './media.service';

const fileFilter = (req, file, cb) => {
  // Vérification du type de fichier
  const allowedMimeTypes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'video/mp4',
  ];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new BadRequestException(
        'Invalid file type. Only mp3, mp4 and wav files are allowed.',
      ),
      false,
    );
  }

  // Vérification de l'extension du fichier
  const allowedExtensions = ['.mp3', '.mp4', '.wav'];
  const ext = extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(
      new BadRequestException(
        'Invalid file extension. Only mp3, mp4 and wav files are allowed.',
      ),
      false,
    );
  }

  // Vérification des caractères du nom de fichier
  const fileName = basename(file.originalname, extname(file.originalname));
  const invalidCharacters = /[^a-zA-Z0-9.\- ]/;
  if (invalidCharacters.test(fileName)) {
    return cb(
      new BadRequestException(
        'Invalid characters in file name. Only letters, numbers, dots, dashes, and spaces are allowed.',
      ),
      false,
    );
  }
  cb(null, true);
};

@UseGuards(AuthGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  async findAll() {
    return this.mediaService.findAll();
  }

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

  @Get(':mediaType/byCategories')
  async getMediasByCategories(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<object> {
    const mediaType: string = req.params.mediaType;
    const data: object =
      await this.mediaService.getMediasByCategories(mediaType);
    return res.status(200).json({
      categoriesCount: Object.keys(data).length,
      categories: data,
    });
  }

  @NeedPermissions('delete_media')
  @Delete(':id')
  async deleteMedia(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<object> {
    const data: { statusCode: number; message: string } =
      await this.mediaService.deleteMedia(id);
    return res.status(data.statusCode).json({ message: data.message });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Déterminer le dossier de destination en fonction du type de fichier
          let uploadPath = '';
          if (
            ['audio/mpeg', 'audio/mp3', 'audio/wav'].includes(file.mimetype)
          ) {
            uploadPath = './music';
          } else if (file.mimetype === 'video/mp4') {
            uploadPath = './movies';
          }
          cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
          const baseName = basename(
            file.originalname,
            extname(file.originalname),
          );
          const randomSuffix = Math.floor(100 + Math.random() * 900);
          const newFileName = `${baseName}-${randomSuffix}${extname(file.originalname)}`;
          cb(null, newFileName);
        },
      }),
      fileFilter,
    }),
  )
  async uploadFile(@UploadedFile() file): Promise<object> {
    return {
      message: 'File uploaded successfully',
      file: file,
    };
  }
}
