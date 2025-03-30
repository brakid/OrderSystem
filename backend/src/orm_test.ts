import { DataSource } from "typeorm"
import { Customer, Order, OrderItem, OrderStatus } from "./types";
import { buildSchema } from "type-graphql";
import { CustomerResolver } from "./resolvers";

export const myDataSource = new DataSource({
    type: "sqlite",
    database: "/Users/hagenschupp/Documents/Projects/OrderSystem/backend/database.sql",
    entities: ['./src/types.ts'],
    logging: true,
    synchronize: true,
})

try {
    await myDataSource.initialize();
    console.log("Data Source has been initialized!");
    console.log(myDataSource.isInitialized);
} catch (err) {
    console.error("Error during Data Source initialization:", err);
}
console.log(await Customer.count());
const c = await Customer.create({ name: 'Test', mailAddress: 'test@address.com' }).save();
console.log(c);
console.log(await Customer.count());

const o = Order.create({ customer: c, items: [], status: OrderStatus.Received });
console.log(await o.save());
console.log(o.hasId());

const c1 = (await Order.find({ relations: ['customer', 'items'] }))[0];
console.log(c1);

const c2 = (await Order.find({ where: { customer: c }, relations: ['customer', 'items'] }))[0];
console.log(c2);

const schema = await buildSchema({
  resolvers: [CustomerResolver],
  emitSchemaFile: "./schema/schema.graphql",
});

console.log(schema.getQueryType());