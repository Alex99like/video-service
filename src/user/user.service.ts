import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./user.entity";
import { Repository } from "typeorm";
import { SubscriptionEntity } from "./subscription.entity";
import { UserDto } from "./user.dto";
import { genSalt, hash } from "bcryptjs";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly subscriptionRepository: Repository<SubscriptionEntity>
  ) {}

  async findAll() {
    return await this.userRepository.find()
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {
        videos: true,
        subscriptions: {
          toChannel: true
        }
      }
    })

    if (!user) throw new NotFoundException('Пользователь не найден!')

    return user
  }

  async updateProfile(id: number, dto: UserDto) {
    const user = await this.findOne(id)

    const isSameUser = await this.userRepository.findOneBy({ email: dto.email })

    if (isSameUser && id !== isSameUser.id) throw new BadRequestException('Email занят')

    if (dto.password) {
      const salt = await genSalt(10)
      user.password = await hash(dto.password, salt)
    }

    user.name = dto.name
    user.email = dto.email
    user.description = dto.description
    user.avatarPath = dto.avatarPath

    return this.userRepository.save(user)
  }

  async subscribe(id: number, channelId: number) {
    const data = {
      toChannel: { id: channelId },
      fromUser: { id }
    }

    const isSubscribed = await this.subscriptionRepository.findOneBy(data)

    if (!isSubscribed) {
      const newSubscription = await this.subscriptionRepository.create(data)
      await this.subscriptionRepository.create(newSubscription)

      return true
    }

    await this.subscriptionRepository.delete(data)
    return false
  }
}