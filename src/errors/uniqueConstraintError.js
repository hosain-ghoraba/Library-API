export default class UniqueConstraintError extends Error {
  constructor(message) {
    super(message);
    this.name = "UniqueConstraintError";
  }
}
