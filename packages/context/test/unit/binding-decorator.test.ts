// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {expect} from '@loopback/testlab';
import {
  bind,
  BindingScope,
  BindingScopeAndTags,
  Constructor,
  Context,
  Binding,
  bindingTemplateFor,
  createBindingFromClass,
  BindingTemplate,
  Provider,
} from '../..';

describe('@bind', () => {
  const scopeAndTags = {
    tags: {rest: 'rest'},
    scope: BindingScope.SINGLETON,
  };

  it('decorates a class', () => {
    const spec = {
      tags: ['rest'],
      scope: BindingScope.SINGLETON,
    };

    @bind(spec)
    class MyController {}

    expect(inspectScopeAndTags(MyController)).to.eql(scopeAndTags);
  });

  it('allows inheritance for certain tags and scope', () => {
    const spec = {
      tags: ['rest'],
      scope: BindingScope.SINGLETON,
    };

    @bind(spec)
    class MyController {}

    class MySubController extends MyController {}

    expect(inspectScopeAndTags(MySubController)).to.eql(scopeAndTags);
  });

  it('ignores `name` and `key` from base class', () => {
    const spec = {
      tags: [
        'rest',
        {
          name: 'my-controller',
          key: 'controllers.my-controller',
        },
      ],
      scope: BindingScope.SINGLETON,
    };

    @bind(spec)
    class MyController {}

    @bind()
    class MySubController extends MyController {}

    const result = inspectScopeAndTags(MySubController);
    expect(result).to.containEql(scopeAndTags);
    expect(result.tags).to.not.containEql({
      name: 'my-controller',
    });
    expect(result.tags).to.not.containEql({
      key: 'controllers.my-controller',
    });
  });

  it('accepts template functions', () => {
    const spec: BindingTemplate = binding => {
      binding.tag('rest').inScope(BindingScope.SINGLETON);
    };

    @bind(spec)
    class MyController {}

    @bind()
    class MySubController extends MyController {}

    expect(inspectScopeAndTags(MySubController)).to.eql(scopeAndTags);
  });

  it('decorates a provider classes', () => {
    const spec = {
      tags: ['rest'],
      scope: BindingScope.CONTEXT,
    };

    @bind.provider(spec)
    class MyProvider implements Provider<string> {
      value() {
        return 'my-value';
      }
    }

    expect(inspectScopeAndTags(MyProvider)).to.eql({
      tags: {rest: 'rest', type: 'provider', provider: 'provider'},
      scope: BindingScope.CONTEXT,
    });
  });

  function inspectScopeAndTags(cls: Constructor<unknown>): BindingScopeAndTags {
    const templateFn = bindingTemplateFor(cls);
    const bindingTemplate = new Binding('template').apply(templateFn);
    return {
      scope: bindingTemplate.scope,
      tags: bindingTemplate.tagMap,
    };
  }
});

describe('createBindingFromClass()', () => {
  it('binds classes', () => {
    const spec: BindingScopeAndTags = {
      tags: {type: 'controller', name: 'my-controller', rest: 'rest'},
      scope: BindingScope.SINGLETON,
    };

    @bind(spec)
    class MyController {}

    const ctx = new Context();
    const binding = givenBinding(MyController, ctx);

    expect(binding.scope).to.eql(spec.scope);
    expect(binding.tagMap).to.containDeep({
      name: 'my-controller',
      type: 'controller',
      rest: 'rest',
    });
    ctx.add(binding);
    expect(ctx.getSync(binding.key)).to.be.instanceof(MyController);
  });

  it('binds provider classes', () => {
    const spec = {
      tags: ['rest', {type: 'provider'}],
      scope: BindingScope.CONTEXT,
    };

    @bind.provider(spec)
    class MyProvider implements Provider<string> {
      value() {
        return 'my-value';
      }
    }

    const ctx = new Context();
    const binding = givenBinding(MyProvider, ctx);

    expect(binding.key).to.eql('providers.MyProvider');
    expect(binding.scope).to.eql(spec.scope);
    expect(binding.tagMap).to.containDeep({
      type: 'provider',
      provider: 'provider',
      rest: 'rest',
    });
    expect(ctx.getSync(binding.key)).to.eql('my-value');
  });

  it('honors the binding key', () => {
    const spec: BindingScopeAndTags = {
      tags: {
        type: 'controller',
        key: 'controllers.my',
        name: 'my-controller',
      },
    };

    @bind(spec)
    class MyController {}

    const binding = givenBinding(MyController);

    expect(binding.key).to.eql('controllers.my');

    expect(binding.tagMap).to.eql({
      name: 'my-controller',
      type: 'controller',
      key: 'controllers.my',
    });
  });

  it('defaults type to class', () => {
    const spec: BindingScopeAndTags = {};

    @bind(spec)
    class MyClass {}

    const binding = givenBinding(MyClass);
    expect(binding.key).to.eql('classes.MyClass');
  });

  function givenBinding(
    cls: Constructor<unknown>,
    ctx: Context = new Context(),
  ) {
    const binding = createBindingFromClass(cls);
    ctx.add(binding);
    return binding;
  }
});
