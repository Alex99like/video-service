import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Base } from "../utils/Base";
import { UserEntity } from "./user.entity";

@Entity('Subscription')
export class SubscriptionEntity extends Base {
  @ManyToOne(() => UserEntity, user => user.subscriptions)
  @JoinColumn({ name: 'from_user_id' })
  fromUser: UserEntity

  @ManyToOne(() => UserEntity, user => user.subscriptions)
  @JoinColumn({ name: 'to_channel_id' })
  toChannel: UserEntity
}