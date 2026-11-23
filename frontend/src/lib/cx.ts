/** Assemble des classes CSS en ignorant les valeurs fausses. */
export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ');
}
