// Should be replaced by a proper error handling system
// Maybe like the Either class
export class DomainError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "DomainError";
  }
}

// simplicity tradeoff
export class InfraStructureError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
    this.name = "InfraStructureError";
  }
}
