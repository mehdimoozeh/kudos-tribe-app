export class KudosModel {
  private member: ID;
  private dayCapacity: number;
  private remainingKudos: number;
  private given: { [member: ID]: number }[] = [];
  private received: { [member: ID]: number }[] = [];
  private _name: string;
  private _totalReceived: number;
  private _totalGiven: number;

  constructor(member: ID, name: string) {
    this.member = member;
    this.dayCapacity = 5;
    this.remainingKudos = this.dayCapacity;
    this._name = name;
    this._totalReceived = 0; // Math.floor(Math.random() * 30);
    this._totalGiven = 0;
  }

  resetRemainingKudos() {
    this.remainingKudos = this.dayCapacity;
  }

  give(receivers: ID[], count: number): number | Error {
    const neededKudos = receivers.length * count;
    if (neededKudos > this.remainingKudos)
      throw new Error('You dont have enough Kudos!');
    receivers.forEach((receiver) => this.given.push({ [receiver]: count }));
    this.remainingKudos -= neededKudos;
    this._totalGiven += neededKudos;
    return neededKudos;
  }

  receive(from: ID, count: number) {
    this.received.push({ [from]: count });
    this._totalReceived += count;
  }

  get name(): string {
    return this._name;
  }

  get totalReceived(): number {
    return this._totalReceived;
  }

  get totalGiven(): number {
    return this._totalGiven;
  }
}
