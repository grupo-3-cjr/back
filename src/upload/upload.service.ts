import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { extname } from 'path';

@Injectable()
export class UploadService {
  private s3Client: S3Client;

 constructor() {
    this.s3Client = new S3Client({
      endpoint: process.env.R2_ENDPOINT as string,
      region: 'auto', 
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {

    const uniqueFileName = `${randomUUID()}${extname(file.originalname)}`;

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME as string,
      Key: uniqueFileName,
      Body: file.buffer,
      ContentType: file.mimetype, 
    });

    try {

      await this.s3Client.send(command);
      
      const publicUrl = process.env.R2_PUBLIC_URL as string;
      return `${process.env.R2_PUBLIC_URL}/${uniqueFileName}`;
    } catch (error) {
      console.error('Erro ao enviar para o Cloudflare R2:', error);
      throw new Error('Falha no upload do arquivo');
    }
  }
  async deleteFile(fileUrl: string) {
    try {
      
      const key = fileUrl.split('/').pop(); 

      if (!key) return;

      const command = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME as string,
        Key: key, 
      });

      await this.s3Client.send(command);
      console.log(`Arquivo ${key} removido do R2 com sucesso.`);
    } catch (error) {
      console.error(`Falha ao remover arquivo do R2:`, error);
    }
  }
}