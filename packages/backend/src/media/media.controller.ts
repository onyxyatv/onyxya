import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { createReadStream } from 'fs';
import { diskStorage } from 'multer';
import { basename, extname } from 'path';
import { Permissions } from 'src/db/permissions';
import { AuthGuard } from 'src/middlewares/auth.guard';
import { PermissionsGuard } from 'src/middlewares/permissions.guard';
import { NeedPermissions } from 'src/permissions/permissions.decorator';
import { MediaService } from './media.service';
import { CustomError } from '@common/errors/CustomError';
import { CustomResponse } from '@common/errors/customResponses';

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

// TODO: Change every permissions to the correct ones
@UseGuards(AuthGuard, PermissionsGuard)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  /**
   * This route is used to get all media.
   * @returns a list of all media
   */
  @Get()
  async findAll() {
    return this.mediaService.findAll();
  }

  /**
   * This route is used to get a media by its id.
   * @param id the id of the media
   * @returns a media
   */
  @Get('mediacard/:id')
  async findById(@Param('id') id: string): Promise<object> {
    return this.mediaService.findByMediaCardId(Number.parseInt(id));
  }

  /**
   * This route is used to sync media
   */
  @Get('sync')
  async syncMedia(): Promise<object> {
    return this.mediaService.syncMedia();
  }

  /**
   * This route is used to get a file by its id.
   * @returns the file
   */
  @Get('getFile/:fileId')
  async getFile(@Req() req: Request, @Res() res: Response): Promise<object> {
    const fileId: number = Number.parseInt(req.params.fileId);
    const data: { statusCode: number; file: string } =
      await this.mediaService.getFileById(fileId);
    return res.status(data.statusCode).json({ file: data.file });
  }

  @Get('stream/:fileId')
  streamFile(): StreamableFile {
    const file = createReadStream(
      '/home/node/media/music/Babalos - Snow Crystal HQ-770.mp3',
    );
    return new StreamableFile(file);
  }

  /**
   * This route is used to get all media by their type.
   * @returns a list of all media by their type
   */
  @Get(':mediaType/byCategories')
  async getMediasByCategories(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<object> {
    const userId: number = req['user'].id;
    const mediaType: string = req.params.mediaType;
    const data: object = await this.mediaService.getMediasByCategories(
      userId,
      mediaType,
    );
    return res.status(200).json({
      categoriesCount: Object.keys(data).length,
      categories: data,
    });
  }

  /**
   * This route is used to delete a media by its id.
   * @param id the id of the media
   * @returns the status of the deletion
   */
  @NeedPermissions(Permissions.DeleteMedia)
  @Delete(':id')
  async deleteMedia(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<object> {
    const data: { statusCode: number; message: string } =
      await this.mediaService.deleteMedia(id);
    return res.status(data.statusCode).json({ message: data.message });
  }

  /**
   * This route is used to upload a file.
   * @param file the file to upload
   * @returns the uploaded file
   */
  @NeedPermissions(Permissions.UploadMedia)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          let uploadPath = '';
          if (
            ['audio/mpeg', 'audio/mp3', 'audio/wav'].includes(file.mimetype)
          ) {
            uploadPath = '/home/node/media/music';
          } else if (file.mimetype === 'video/mp4') {
            uploadPath = '/home/node/media/movies';
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

  @NeedPermissions(Permissions.ReadMedias)
  @Delete('stream/delete/:mediaId')
  async deleteMediaStreamFiles(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<object> {
    const mediaId: number = Number.parseInt(req.params.mediaId);
    const data: CustomError | CustomResponse =
      await this.mediaService.deleteMediaStreamFiles(mediaId);
    return res.status(data.statusCode).json(data);
  }
}
