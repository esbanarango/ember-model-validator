/* eslint-disable @typescript-eslint/no-explicit-any */
import 'ember-data/types/registries/model';

declare module 'ember-data/types/registries/model' {
  export default interface ModelRegistry {
    [key: string]: any;
  }
}
