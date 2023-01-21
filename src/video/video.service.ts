import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhereProperty, Repository, ILike, MoreThan } from 'typeorm';
import { VideoEntity } from './video.entity';
import { VideoDto } from './video.dto';

@Injectable()
export class VideoService {
  constructor(
    @InjectRepository(VideoEntity)
    private readonly videoRepository: Repository<VideoEntity>,
  ) {}

  //by-id
  async byId(id: number, isPublic: boolean = false) {
    const video = await this.videoRepository.findOne({
      where: isPublic
        ? {
          id,
          isPublic: true,
        }
        : {
          id,
        },
      relations: {
        user: true,
        comment: {
          user: true,
        },
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerified: true,
          subscribersCount: true,
          subscriptions: true,
        },
        comment: {
          message: true,
          id: true,
          user: {
            id: true,
            name: true,
            avatarPath: true,
            isVerified: true,
            subscribersCount: true,
          },
        },
      },
    });
    if (!video) throw new NotFoundException('Видео не найдено!');
    return video;
  }
  //

  //update
  async updateVideo(id: number, dto: VideoDto) {
    const video = await this.byId(id);
    return this.videoRepository.save({
      ...video,
      ...dto,
    });
  }

  //getAll
  async getAll(searchTerm?: string) {
    let options: FindOptionsWhereProperty<VideoEntity> = {};

    if (searchTerm) {
      options = {
        name: ILike(`%${searchTerm}%`),
      };
    }
    return this.videoRepository.find({
      where: {
        ...options,
        isPublic: true,
      },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        user: true,
        comment: {
          user: true,
        },
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerified: true,
        },
      },
    });
  }

  async getMostPopularByViews() {
    return this.videoRepository.find({
      where: {
        views: MoreThan(0),
      },
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          name: true,
          avatarPath: true,
          isVerified: true,
        },
      },
      order: {
        views: -1,
      },
    });
  }

  async createVideo(userId: number) {
    const defaultValue = {
      name: '',
      user: { id: userId },
      videoPath: '',
      description: '',
      thumbnailPath: '',
    };
    const newVideo = this.videoRepository.create(defaultValue);
    const video = await this.videoRepository.save(newVideo);
    return video.id;
  }

  async deleteVideo(id: number) {
    return this.videoRepository.delete({ id });
  }

  async updateCountViews(id: number) {
    const video = await this.byId(id);
    video.views++;
    return this.videoRepository.save(video);
  }

  async updateLikes(id: number) {
    const video = await this.byId(id);
    video.likes++;
    return this.videoRepository.save(video);
  }

  async updateDislikes(id: number) {
    const video = await this.byId(id);
    video.dislikes++;
    return this.videoRepository.save(video);
  }

  async deleteLikes(id: number) {
    const video = await this.byId(id);
    video.likes--;
    return this.videoRepository.save(video);
  }

  async deleteDislikes(id: number) {
    const video = await this.byId(id);
    video.dislikes--;
    return this.videoRepository.save(video);
  }
}