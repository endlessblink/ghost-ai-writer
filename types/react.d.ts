import 'react';

declare module 'react' {
  interface TouchList {
    [index: number]: Touch;
    item(index: number): Touch | null;
    length: number;
    [Symbol.iterator](): IterableIterator<Touch>;
  }

  interface TouchEvent<T = Element> extends UIEvent {
    altKey: boolean;
    changedTouches: TouchList;
    ctrlKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
    targetTouches: TouchList;
    touches: TouchList;
    [Symbol.iterator](): IterableIterator<Touch>;
  }
} 