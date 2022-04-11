export class KudosModel {
  private member: ID;
  private name: string;
  private dayCapacity: number;
  private remainingKudos: number;
  private given: { [member: ID]: number }[] = [];
  private received: { [member: ID]: number }[] = [];

  constructor(member: ID, name: string) {
    this.member = member;
    this.name = name;
    this.dayCapacity = 5;
    this.remainingKudos = this.dayCapacity;
  }

  give(receivers: ID[], count: number): number | Error {
    const totalGiven = receivers.length * count;
    if (totalGiven > this.remainingKudos)
      throw new Error('You dont have enough Kudos!');
    receivers.forEach((receiver) => this.given.push({ [receiver]: count }));
    this.remainingKudos -= totalGiven;
    return totalGiven;
  }

  receive(from: ID, count: number) {
    this.received.push({ [from]: count });
  }
}
