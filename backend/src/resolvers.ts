import { Arg, FieldResolver, Query, Resolver, Root, type ResolverInterface } from 'type-graphql';
import { Customer, Order, OrderStatus } from './types';

@Resolver(of => Customer)
export class CustomerResolver implements ResolverInterface<Customer> {
  @Query(returns => [Customer])
  async getCustomers(): Promise<Customer[]> {
    return await Customer.find();
  }

  @Query(returns => Customer, { nullable: true })
  async getCustomer(
    @Arg('name') name: string): Promise<Customer | undefined> {
    const matchingCustomers = await Customer.find({ where: { name } });
    if (matchingCustomers) {
        return matchingCustomers[0];
    }
    return undefined;
  }

  @FieldResolver(type => [Order])
  async getOrders(@Root() customer: Customer, @Arg('statuses', () => [OrderStatus], { nullable: true, defaultValue: Object.values(OrderStatus) }) statuses: OrderStatus[]): Promise<Order[]> {
    if (statuses.length == 0) {
      return Order.find({ where: { customer }, relations: ['customer', 'items'] });
    }
    return Order.find({ where: statuses.map(status => ({ customer, status })), relations: ['customer', 'items'] });
  }
}