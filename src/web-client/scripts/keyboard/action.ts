import { useLayoutEffect } from "react"
import { Key, Location, EventType } from './types';

type Action = {
  key: Key | Set<Key>,
  options: ActionOptions,
  handler: ActionHandler,
};

type ActionOptions = {
    alt: boolean | undefined,
    ctrl: boolean | undefined,
    meta: boolean | undefined,
    shift: boolean | undefined,
    isComposing: boolean | undefined,
    repeat: boolean | undefined,
    location: Location | Set<Location>,
};
const satisfyOptions = ({ alt, ctrl, meta, shift, isComposing, repeat, location }: Partial<ActionOptions>): ActionOptions => {
  return {
    alt, ctrl, meta, shift, isComposing, repeat,
    location: location || new Set,
  }
};

type ActionHandler = () => void;

const matchesAction = (event: KeyboardEvent, { key, options: { alt, ctrl, meta, shift, isComposing, repeat, location } }: Action) => {
  return (alt == null || event.altKey === alt)
    && (ctrl == null || event.metaKey === meta)
    && (shift == null || event.shiftKey === shift)
    && (isComposing == null || event.isComposing === isComposing)
    && (repeat == null || event.repeat === repeat)
    && ('string' === typeof key ? key === event.key : key.has(event.key as Key))
    && ('number' === typeof location ? event.location === location : location.has(event.location))
};

class ActionManager {
  #eventListener: (event: KeyboardEvent) => void
  #actions: Map<bigint, Action>;
  #nextId = 0n;

  constructor(readonly eventType: EventType) {
    this.#actions = new Map;
    this.#eventListener = ev => {
      for (const action of this.#actions.values()) {
        if (matchesAction(ev, action)) {
          action.handler();
        }
      }
    }
  }
  
  add(action: Action) {
    this.#actions.set(this.#nextId, action);
    if (this.#actions.size === 1) document.addEventListener(this.eventType, this.#eventListener);
    return this.#nextId++;
  }
  del(id: bigint) {
    if (!this.#actions.delete(id)) throw Error(`the ${ this.eventType } action whose id is ${ id } is not registerd.`);
    if (this.#actions.size === 0) document.removeEventListener(this.eventType, this.#eventListener);
  }
}

const useAction = (actionManager: ActionManager, key: Key | Key[], handler: ActionHandler, options: Partial<ActionOptions> = {}) => {
  useLayoutEffect(() => {
    const action = {
      key: 'string' === typeof key ? key : new Set(key),
      handler,
      options: satisfyOptions(options),
    };

    const id = actionManager.add(action);
    return () => {
      actionManager.del(id);
    };
  }, [handler, options]);
};

const keyupActionManager = new ActionManager('keyup');
const keypressActionManager = new ActionManager('keypress');
const keydownActionManager = new ActionManager('keydown');

type UseActionFn = (key: Key | Key[], handler: ActionHandler, options?: Partial<ActionOptions>) => void;
export const useKeyupAction: UseActionFn = (...args) => useAction(keyupActionManager, ...args);
export const useKeypressAction: UseActionFn = (...args) => useAction(keypressActionManager, ...args);
export const useKeydownAction: UseActionFn = (...args) => useAction(keydownActionManager, ...args);

