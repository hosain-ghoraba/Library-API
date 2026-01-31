export default class UniqueConstraintException extends Error {
  constructor(message) {
    super(message);
    this.name = "UniqueConstraintException";
  }
}
