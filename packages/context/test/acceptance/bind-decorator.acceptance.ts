// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect} from '@loopback/testlab';
import {Context, bind, BindingScope, Provider} from '../..';
import {createBindingFromClass} from '../../src';

describe('@bind - customize classes with binding attributes', () => {
  @bind({
    scope: BindingScope.SINGLETON,
    tags: ['service'],
  })
  class MyService {}

  @bind.provider({
    tags: {
      key: 'my-date-provider',
    },
  })
  class MyDateProvider implements Provider<Date> {
    value() {
      return new Date();
    }
  }

  @bind({
    tags: ['controller', {name: 'my-controller'}],
  })
  class MyController {}

  const discoveredClasses = [MyService, MyDateProvider, MyController];

  it('allows discovery of classes to be bound', () => {
    const ctx = new Context();
    discoveredClasses.forEach(c => {
      const binding = createBindingFromClass(c);
      if (binding.tagMap.controller) {
        ctx.add(binding);
      }
    });
    expect(ctx.findByTag('controller').map(b => b.key)).eql([
      'controllers.my-controller',
    ]);
    expect(ctx.find().map(b => b.key)).eql(['controllers.my-controller']);
  });

  it('allows binding attributes to be customized', () => {
    const ctx = new Context();
    discoveredClasses.forEach(c => {
      const binding = createBindingFromClass(c);
      ctx.add(binding);
    });
    expect(ctx.findByTag('provider').map(b => b.key)).eql(['my-date-provider']);
    expect(ctx.getBinding('classes.MyService').scope).to.eql(
      BindingScope.SINGLETON,
    );
    expect(ctx.find().map(b => b.key)).eql([
      'classes.MyService',
      'my-date-provider',
      'controllers.my-controller',
    ]);
  });
});
