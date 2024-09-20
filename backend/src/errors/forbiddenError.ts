export function forbiddenError(message: string) {
  this.name = 'forbiddenError';
  this.message = message;
};
