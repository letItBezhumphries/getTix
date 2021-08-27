import { Publisher, Subjects, TicketCreatedEvent } from '@ezhtix/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
