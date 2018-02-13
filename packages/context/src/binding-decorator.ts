// Copyright IBM Corp. 2018. All Rights Reserved.
// Node module: @loopback/context
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {ClassDecoratorFactory, MetadataInspector} from '@loopback/metadata';
import {Binding, BindingScope, BindingTemplate, TagMap} from './binding';
import {Provider} from './provider';
import {Constructor} from './value-promise';

const BINDING_METADATA_KEY = 'binding.metadata';

type BindingMetadata = {
  templates: BindingTemplate[];
  target?: Constructor<unknown>;
};

const removeNameAndKey: BindingTemplate = binding => {
  if (binding.tagMap) {
    delete binding.tagMap.name;
    delete binding.tagMap.key;
  }
};

class BindDecoratorFactory extends ClassDecoratorFactory<BindingMetadata> {
  mergeWithInherited(inherited: BindingMetadata, target: Function) {
    if (inherited) {
      return {
        templates: [
          ...inherited.templates,
          removeNameAndKey,
          ...this.spec.templates,
        ],
        target: this.spec.target,
      };
    } else {
      this.withTarget(this.spec, target);
      return this.spec;
    }
  }

  withTarget(spec: BindingMetadata, target: Function) {
    spec.target = target as Constructor<unknown>;
    return spec;
  }
}

export type BindingScopeAndTags = {
  scope?: BindingScope;
  tags?: string | TagMap | (string | TagMap)[];
};

/**
 * Decorate a class with binding configuration
 *
 * @example
 * ```ts
 * @bind((binding) => {binding.inScope(BindingScope.SINGLETON).tag('controller')}
 * )
 * export class MyController {
 * }
 * ```
 *
 * @param templates A list of binding scope/tags or template functions to
 * configure the binding
 */
export function bind(
  ...templates: (BindingTemplate | BindingScopeAndTags)[]
): ClassDecorator {
  const templateFunctions = templates.map(t => {
    if (typeof t === 'function') {
      return t;
    } else {
      return asBindingTemplate(t);
    }
  });

  return (target: Function) => {
    const spec: BindingMetadata = {
      templates: [
        // Add a template to bind to a class
        binding => {
          binding.toClass(target as Constructor<unknown>);
        },
        ...templateFunctions,
      ],
    };

    const decorator = BindDecoratorFactory.createDecorator(
      BINDING_METADATA_KEY,
      spec,
    );
    decorator(target);
  };
}

export namespace bind {
  /**
   * `@bind.provider` to denote a provider class
   *
   * A list of binding scope/tags or template functions to configure the binding
   */
  export function provider(
    ...templates: (BindingTemplate | BindingScopeAndTags)[]
  ): ((target: Constructor<Provider<unknown>>) => void) {
    return (target: Constructor<Provider<unknown>>) => {
      bind(
        // Set up the default for providers
        binding =>
          binding.toProvider(target).tag('provider', {type: 'provider'}),
        // Call other template functions
        ...templates,
      )(target);
    };
  }
}

/**
 * Convert binding scope and tags as a template function
 * @param scopeAndTags
 */
function asBindingTemplate(scopeAndTags: BindingScopeAndTags): BindingTemplate {
  return binding => {
    if (scopeAndTags.scope) {
      binding.inScope(scopeAndTags.scope);
    }
    if (scopeAndTags.tags) {
      if (Array.isArray(scopeAndTags.tags)) {
        binding.tag(...scopeAndTags.tags);
      } else {
        binding.tag(scopeAndTags.tags);
      }
    }
  };
}

/**
 * Get binding metadata for a class
 * @param target The target class
 */
export function getBindingMetadata(
  target: Function,
): BindingMetadata | undefined {
  return MetadataInspector.getClassMetadata<BindingMetadata>(
    BINDING_METADATA_KEY,
    target,
  );
}

/**
 * Get the binding template from a class with binding metadata
 *
 * @param cls A class with optional `@bind`
 */
export function bindingTemplateFor(cls: Constructor<unknown>): BindingTemplate {
  const spec = getBindingMetadata(cls);
  const templateFunctions = (spec && spec.templates) || [];
  return binding => {
    for (const t of templateFunctions) {
      binding.apply(t);
    }
    if (spec && spec.target !== cls) {
      // Remove name/key from base classes
      binding.apply(removeNameAndKey);
    }
  };
}

export const TYPE_NAMESPACES: {[name: string]: string} = {
  controller: 'controllers',
  repository: 'repositories',
  model: 'models',
  dataSource: 'dataSources',
  server: 'servers',
  class: 'classes',
  provider: 'providers',
};

function getNamespace(type: string) {
  if (type in TYPE_NAMESPACES) {
    return TYPE_NAMESPACES[type];
  } else {
    return `${type}s`;
  }
}

/**
 * Create a binding from a class with decorated metadata
 * @param cls A class
 * @param key Optional binding key. If not present, infer it from the class
 */
export function createBindingFromClass<T = unknown>(
  cls: Constructor<unknown>,
  key?: string,
): Binding<T> {
  const templateFn = bindingTemplateFor(cls);
  // Create a dummy binding if key is not provided
  if (!key) {
    const bindingTemplate = new Binding('template').apply(templateFn);
    // Is there a key tag?
    key = bindingTemplate.tagMap['key'];
    if (!key) {
      // Drive the key from type + name
      let type = bindingTemplate.tagMap['type'];
      if (!type) {
        type =
          bindingTemplate.tagNames.find(t => TYPE_NAMESPACES[t] != null) ||
          'class';
      }
      const name = bindingTemplate.tagMap['name'] || cls.name;
      key = `${getNamespace(type)}.${name}`;
    }
  }
  return new Binding<T>(key).apply(templateFn);
}
