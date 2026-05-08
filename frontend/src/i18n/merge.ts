/* eslint-disable @typescript-eslint/no-explicit-any */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Record<string, unknown> ? DeepPartial<T[K]> : T[K];
};

export function mergeDeep<T extends Record<string, any>>(base: T, patch: DeepPartial<T>): T {
  const out = { ...base } as T;
  for (const key of Object.keys(patch) as (keyof T)[]) {
    const pv = patch[key];
    const bv = base[key];
    if (pv !== undefined && typeof pv === "object" && !Array.isArray(pv) && bv !== undefined && typeof bv === "object" && !Array.isArray(bv)) {
      (out as any)[key] = mergeDeep(bv as any, pv as any);
    } else if (pv !== undefined) {
      (out as any)[key] = pv;
    }
  }
  return out;
}
