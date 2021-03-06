/* eslint-disable @typescript-eslint/no-explicit-any */
import { store } from '../../helper/store';
import { MODEL_NAME } from '@dxjs/shared/symbol';
import { DxModelContstructor } from '../../dx-model/model';

export type GetModels = DxModelContstructor | DxModelContstructor[] | { [key: string]: DxModelContstructor } | undefined;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function modelsFactory() {
  function getModels(): { [key: string]: DxModelContstructor };
  function getModels(match: RegExp): DxModelContstructor[];
  function getModels(match: string): DxModelContstructor;

  function getModels(match?: string | RegExp): GetModels {
    const map = store.getModels()?.map || {};
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const set = store.getModels()?.set || new Set();
    if (!match) return map;
    if (__DEV__) {
      require('invariant')(
        ['string', 'undefined'].some(type => typeof match === type) || match instanceof RegExp,
        '请传入有效的参数，当前参数类型为 %s, 但只接受 string、undefined、regexp 的类型',
        typeof match,
      );
      require('invariant')(store.reduxStore, 'store 还没有创建，请先调用 Dx.createStore 或 Dx.create 创建 store');
    }

    function getModelName(model: DxModelContstructor): string {
      return Reflect.getMetadata(MODEL_NAME, model) ?? model.name;
    }

    if (typeof match === 'string') {
      if (Reflect.has(map, match)) return Reflect.get(map, match);
      return [...set].find(model => getModelName(model).startsWith(match));
    }

    return [...set].filter(model => match.test(getModelName(model)));
  }
  return getModels;
}
