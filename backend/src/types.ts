import { Entity, Column, BaseEntity, JoinTable, ManyToOne, ManyToMany, PrimaryColumn } from 'typeorm';
import { Field, Float, ID, Int, ObjectType, registerEnumType } from 'type-graphql';
import { randomUUID, type UUID } from 'crypto';

export enum OrderStatus {
  InPreparation = 'IN_PREPARATION',
  Paid = 'PAID',
  Prepared = 'PREPARED',
  Received = 'RECEIVED'
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@Entity()
@ObjectType()
export class Customer extends BaseEntity {
  @PrimaryColumn({ type: 'text' })
  @Field(type => ID)
  id: UUID = randomUUID()
  @Column({ unique: true })
  @Field()
  name: string
  @Column({ nullable: true })
  @Field({ nullable: true })
  mailAddress?: string
  @Column({ nullable: true })
  @Field({ nullable: true })
  phoneNumber?: string
  @Field(type => [Order], { nullable: true })
  getOrders!: Order[]
};

@Entity()
@ObjectType()
export class Item extends BaseEntity {
  @PrimaryColumn({ type: 'text' })
  @Field(type => ID)
  id: UUID = randomUUID()
  @Column()
  @Field()
  description!: string
  @Column({ unique: true })
  @Field()
  name!: string
  @Column({ type: 'float' })
  @Field(type => Float)
  price!: number
};

@Entity()
@ObjectType()
export class Menu extends BaseEntity {
  @PrimaryColumn({ type: 'text' })
  @Field(type => ID)
  id: UUID = randomUUID()
  @ManyToMany(type => MenuItem)
  @JoinTable()
  @Field(type => [MenuItem])
  items!: MenuItem[]
};

@Entity()
@ObjectType()
export class MenuItem extends BaseEntity {
  @PrimaryColumn({ type: 'text' })
  @Field(type => ID)
  id: UUID = randomUUID()
  @Column()
  @Field()
  available: boolean = true
  @ManyToOne(type => Item)
  @Field((type => Item!))
  item!: Item
};

@Entity()
@ObjectType()
export class Order extends BaseEntity {
  @PrimaryColumn({ type: 'text' })
  @Field(type => ID)
  id: UUID = randomUUID()
  @ManyToOne(type => Customer)
  @Field(type => Customer!)
  customer!: Customer
  @ManyToMany(type => OrderItem)
  @JoinTable()
  @Field(type => [OrderItem])
  items!: OrderItem[]
  @Column({ type: 'text' })
  @Field(type => OrderStatus)
  status: OrderStatus = OrderStatus.Received
  // no side effect
  @Field(type => Float)
  orderPrice(): number {
    return this.items.map(orderItem => orderItem.quantity * orderItem.item.price).reduce((sum, current) => sum + current, 0);
  }
};

@Entity()
@ObjectType()
export class OrderItem extends BaseEntity {
  @PrimaryColumn({ type: 'text' })
  @Field(type => ID)
  id: UUID = randomUUID()
  @ManyToOne(type => Item)
  @Field(type => Item!)
  item!: Item
  @Column({ type: 'int' })
  @Field(type => Int)
  quantity: number = 1
};