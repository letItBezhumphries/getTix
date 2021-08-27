import { OrderCancelledEvent, OrderStatus } from "@ezhtix/common";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';


const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  // store an orderId
  const orderId =  mongoose.Types.ObjectId().toHexString();

  // crate and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 88,
    userId: '2iei'
  });

  ticket.set({ orderId });
  await ticket.save();

  // create the fake data event
  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id
    }
  }

  //  @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, msg, data, orderId };
}


it('updates the ticket', async () => {
  const { listener, ticket, data, msg, orderId } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();

  
});



it('acks the message', async () => {
  const { listener, ticket, data, msg, orderId } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});


it('publishes an event', async () => {

  const { listener, data, msg, ticket, orderId } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

});