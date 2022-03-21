export class BasicError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super();
    this.status = status;
    this.message = message;
  }
}
