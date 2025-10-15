import { isEmptyObject } from './is-empty-object';

export function returnOrThrowWhenEmpty<
  ArgType,
  ReturnType = Exclude<ArgType, null | undefined>,
>(data: ArgType): ReturnType {
  if (!data || isEmptyObject(data)) {
    throw new Error('Empty data');
  }

  return data as unknown as ReturnType;
}
