export default class DBConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "DBConflictError";
  }
}
