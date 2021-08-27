import { Subjects, Publisher, PaymentCreatedEvent } from '@ezhtix/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
