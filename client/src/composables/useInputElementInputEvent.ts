export const useInputElementInputEvent =
  (callback: (value: string) => void) => (event: Event) => {
    callback((event.target as HTMLInputElement).value);
  };
