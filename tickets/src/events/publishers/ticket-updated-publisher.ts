import { Publisher, Subjects, TicketUpdatedEvent } from '@ezhtix/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
