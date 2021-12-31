import { computed, readonly, ref } from "vue";
import { produce } from "immer";

import type { ComputedRef, DeepReadonly, UnwrapRef } from "vue";
import type { Nothing } from "immer/dist/internal";

export type ReturnTypeOfUseImmerRef<T> = [
  ComputedRef<T extends object ? DeepReadonly<UnwrapRef<T>> : UnwrapRef<T>>,
  (
    recipe: (
      draft: T
    ) => T | void | undefined | (T extends undefined ? Nothing : never)
  ) => void
];

export function useImmerRef<T>(initial: T): ReturnTypeOfUseImmerRef<T> {
  const _ref = ref(initial);

  return [
    computed(
      () =>
        (_ref.value instanceof Object
          ? readonly(_ref.value)
          : _ref.value) as T extends object
          ? DeepReadonly<UnwrapRef<T>>
          : UnwrapRef<T>
    ),
    (recipe) => {
      const newValue = produce(_ref.value, recipe);
      _ref.value = newValue;
    },
  ];
}
