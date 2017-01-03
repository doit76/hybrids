import { define, CONTROLLER } from '@hybrids/core';
import engine from '../../src/engine';

import { MARKER_PREFIX as M } from '../../src/template';

describe('Engine | Markers | Class -', () => {
  let el;
  let ctrl;

  beforeAll(() => {
    class EngineMarkersClassTest {
      static get options() {
        return {
          providers: [engine],
          template: `
            <div id="simple" ${M}class="one: keys.one; two: keys.two"></div>
            <div id="keys" ${M}class="keys"></div>
            <div id="array" ${M}class="array"></div>
          `
        };
      }

      constructor() {
        this.keys = {
          one: true,
          two: false,
          three: true,
        };
        this.array = ['one', 'two'];
      }
    }

    define({ EngineMarkersClassTest });
  });

  beforeEach(() => {
    el = document.createElement('engine-markers-class-test');
    ctrl = el[CONTROLLER];
    document.body.appendChild(el);
  });

  afterEach(() => {
    document.body.removeChild(el);
  });

  function getId(id) {
    return el.shadowRoot.querySelector(`#${id}`);
  }

  rafIt('set simple', () => {
    expect(getId('simple').classList.contains('one')).toEqual(true);
    expect(getId('simple').classList.contains('two')).toEqual(false);
  });

  rafIt('update simple', () => {
    delete ctrl.keys.one;
    ctrl.keys.two = true;
    ctrl.keys.three = false;

    const simple = getId('simple');
    requestAnimationFrame(() => {
      expect(simple.classList.contains('one')).toEqual(false);
      expect(simple.classList.contains('two')).toEqual(true);
      expect(simple.classList.contains('three')).toEqual(false);
    });
  });

  rafIt('set keys', () => {
    const keys = getId('keys');
    expect(keys.classList.contains('one')).toEqual(true);
    expect(keys.classList.contains('two')).toEqual(false);
  });

  rafIt('update keys', () => {
    delete ctrl.keys.one;
    ctrl.keys.two = true;
    ctrl.keys.three = true;
    const keys = getId('keys');
    requestAnimationFrame(() => {
      expect(keys.classList.contains('one')).toEqual(false);
      expect(keys.classList.contains('two')).toEqual(true);
      expect(keys.classList.contains('three')).toEqual(true);
    });
  });

  rafIt('set array', () => {
    const keys = getId('array');
    expect(keys.classList.contains('one')).toEqual(true);
    expect(keys.classList.contains('two')).toEqual(true);
  });

  rafIt('remove item in array', () => {
    ctrl.array.splice(1, 1);

    requestAnimationFrame(() => {
      const array = getId('array');
      expect(array.classList.contains('one')).toEqual(true);
      expect(array.classList.contains('two')).toEqual(false);
    });
  });

  rafIt('set item in array', () => {
    ctrl.array[0] = 'new-value';

    requestAnimationFrame(() => {
      const array = getId('array');
      expect(array.classList.contains('new-value')).toEqual(true);
      expect(array.classList.contains('one')).toEqual(false);
    });
  });

  rafIt('add item in array', () => {
    ctrl.array.push('new-value');

    requestAnimationFrame(() => {
      const array = getId('array');
      expect(array.classList.contains('one')).toEqual(true);
      expect(array.classList.contains('two')).toEqual(true);
      expect(array.classList.contains('new-value')).toEqual(true);
    });
  });
});