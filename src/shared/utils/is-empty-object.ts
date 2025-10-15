export function isEmptyObject(
  data: Record<string, unknown> | undefined,
): boolean {
  return (
    typeof data === 'undefined'
    || (typeof data === 'object' && Object.keys(data).length === 0)
  );
}
