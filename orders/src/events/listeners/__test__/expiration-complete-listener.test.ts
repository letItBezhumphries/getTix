import { ExpirationCompleteEvent, OrderStatus } from "@ezhtix/common";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';


const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client)

  const ticket = await Ticket.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 25
  });
  await ticket.save();

  const order = await Order.build({
    status: OrderStatus.Created,
    userId: 'sieahiehac',
    expiresAt: new Date(),
    ticket,
  });

  await order.save();


  // create a fake data event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  }

  // create a fake message object 
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, data, msg, order, ticket };
}



it('updates the order status to cancelled', async () => {
  const { listener, data, msg, order } = await setup();
  
  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});


it('emits an OrderCancelled event', async () => {
  const { listener, data, msg, order } = await setup();
  
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // call returns array of all the times that its been invoked
  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

  expect(eventData.id).toEqual(order.id);
});


it('acks the message', async () => {
  
  const { listener, data, msg } = await setup();
  
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});