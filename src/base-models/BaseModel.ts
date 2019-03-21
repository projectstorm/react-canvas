import { BaseEvent, BaseListener, BaseObject, Toolkit } from '@projectstorm/react-core';
import { CanvasEngine } from '../CanvasEngine';

export interface Serializable {
  _type: string;
  id: string;
}

export interface BaseModelListener<T extends BaseModel = BaseModel> extends BaseListener<T> {
  lockChanged?(event: BaseEvent<T> & { locked: boolean });
  delegateEvent?(event: BaseEvent<T>);
}

export class DeserializeEvent {
  data: { [p: string]: any };
  engine: CanvasEngine;
  cache: { [id: string]: BaseModel };

  constructor(data: any, engine: CanvasEngine) {
    this.cache = {};
    this.data = data;
    this.engine = engine;
  }

  subset(key: string): DeserializeEvent {
    let event = new DeserializeEvent(this.data[key], this.engine);
    event.cache = this.cache;
    return event;
  }
}

export class BaseModel<
  PARENT extends BaseModel<any, BaseModelListener> = any,
  LISTENER extends BaseModelListener = BaseListener
> extends BaseObject<LISTENER> {
  protected parent: PARENT;
  protected id: string;
  protected type: string;
  protected locked: boolean;
  private parentListener: string;

  constructor(type: string) {
    super();
    this.id = Toolkit.UID();
    this.type = type;
    this.parentListener = null;
  }

  isLocked(): boolean {
    return this.locked || (this.parent && this.parent.isLocked());
  }

  setParent(parent: PARENT) {
    if (this.parentListener) {
      this.parent.removeListener(this.parentListener);
    }
    this.parent = parent;
    if (parent) {
      this.parentListener = parent.addListener({
        delegateEvent: event => {
          if (parent.parent) {
            parent.parent.iterateListeners('delegating event', listener => {
              if (listener.delegateEvent) {
                listener.delegateEvent(event);
              }
            });
          }
        }
      });
    }
  }

  getType(): string {
    return this.type;
  }

  getParent(): PARENT {
    return this.parent;
  }

  public clearListeners() {
    this.listeners = {};
  }

  iterateListeners(name: string, cb: (t: LISTENER, event: BaseEvent) => any) {
    // optionally delegate the event up the stack so the event bus can grab it
    if (this.parent) {
      this.parent.iterateListeners(name, (listener, event) => {
        if (listener.delegateEvent) {
          listener.delegateEvent(event);
        }
      });
    }
    return super.iterateListeners(name, cb);
  }

  public deSerialize(event: DeserializeEvent) {
    this.id = event.data.id;
    this.locked = !!event.data.locked;
    if (event.data['parent']) {
      if (!event.cache[event.data['parent']]) {
        throw 'Cannot deserialize, because of missing parent';
      }
      this.setParent(event.cache[event.data['parent']] as any);
    }
    event.cache[this.id] = this;
  }

  public serialize(): Serializable & any {
    return {
      _type: this.type,
      id: this.id,
      parent: this.parent && this.parent.id,
      locked: this.locked
    };
  }

  public getID() {
    return this.id;
  }
}
