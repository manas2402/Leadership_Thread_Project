export function randomString(len: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < len; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function uniqueEmail(prefix = 'user'): string {
  return `${prefix}+${Date.now()}-${randomString(5)}@example.com`;
}

export function uniqueFirstName(): string {
  return `First${Date.now()}`;
}

export function uniqueLastName(): string {
  return `Last${randomString(6)}`;
}

