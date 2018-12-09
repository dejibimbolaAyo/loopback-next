// Copyright IBM Corp. 2017,2018. All Rights Reserved.
// Node module: @loopback/cli
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const expect = require('@loopback/testlab').expect;
const {
  loadSpec,
  loadAndBuildSpec,
} = require('../../../generators/openapi/spec-loader');
const {
  generateModelSpecs,
} = require('../../../generators/openapi/schema-helper');
const path = require('path');

describe('schema to model', () => {
  let usptoSpec, usptoSpecAnonymous, petstoreSpec, customerSepc;
  const uspto = path.join(__dirname, '../../fixtures/openapi/3.0/uspto.yaml');
  const petstore = path.join(
    __dirname,
    '../../fixtures/openapi/3.0/petstore-expanded.yaml',
  );
  const customer = path.join(
    __dirname,
    '../../fixtures/openapi/3.0/customer.yaml',
  );

  before(async () => {
    usptoSpec = await loadSpec(uspto);
    usptoSpecAnonymous = await loadAndBuildSpec(uspto, {
      promoteAnonymousSchemas: true,
    });
    petstoreSpec = await loadSpec(petstore);
    customerSepc = await loadSpec(customer);
  });

  it('generates models for uspto', () => {
    const objectTypeMapping = new Map();
    const models = generateModelSpecs(usptoSpec, {objectTypeMapping});
    expect(models).to.eql([
      {
        name: 'dataSetList',
        description: 'dataSetList',
        className: 'DataSetList',
        fileName: 'data-set-list.model.ts',
        import: "import {DataSetList} from './data-set-list.model';",
        imports: [],
        kind: 'class',
        properties: [
          {
            name: 'total',
            signature: 'total?: number;',
            decoration: "@property({name: 'total'})",
          },
          {
            name: 'apis',
            signature:
              'apis?: {\n  apiKey?: string;\n  apiVersionNumber?: string;\n' +
              '  apiUrl?: string;\n  apiDocumentationUrl?: string;\n}[];',
            decoration: "@property({name: 'apis'})",
          },
        ],
        declaration:
          '{\n  total?: number;\n  apis?: {\n  apiKey?: string;\n' +
          '  apiVersionNumber?: string;\n  apiUrl?: string;\n' +
          '  apiDocumentationUrl?: string;\n}[];\n}',
        signature: 'DataSetList',
      },
    ]);
  });

  it('generates models for uspto with promoted anonymous schemas', () => {
    const models = usptoSpecAnonymous.modelSpecs;
    expect(models).to.eql([
      {
        description: 'dataSetList',
        name: 'dataSetList',
        className: 'DataSetList',
        fileName: 'data-set-list.model.ts',
        properties: [
          {
            name: 'total',
            signature: 'total?: number;',
            decoration: "@property({name: 'total'})",
          },
          {
            name: 'apis',
            signature:
              'apis?: {\n  apiKey?: string;\n  apiVersionNumber?: string;\n  ' +
              'apiUrl?: string;\n  apiDocumentationUrl?: string;\n}[];',
            decoration: "@property({name: 'apis'})",
          },
        ],
        imports: [],
        import: "import {DataSetList} from './data-set-list.model';",
        kind: 'class',
        declaration:
          '{\n  total?: number;\n  apis?: {\n  apiKey?: string;\n  ' +
          'apiVersionNumber?: string;\n  apiUrl?: string;\n  ' +
          'apiDocumentationUrl?: string;\n}[];\n}',
        signature: 'DataSetList',
      },
      {
        description: 'dataSetList',
        name: 'dataSetList',
        className: 'DataSetList',
        fileName: 'data-set-list.model.ts',
        properties: [
          {
            name: 'total',
            signature: 'total?: number;',
            decoration: "@property({name: 'total'})",
          },
          {
            name: 'apis',
            signature:
              'apis?: {\n  apiKey?: string;\n  apiVersionNumber?: string;\n  ' +
              'apiUrl?: string;\n  apiDocumentationUrl?: string;\n}[];',
            decoration: "@property({name: 'apis'})",
          },
        ],
        imports: [],
        import: "import {DataSetList} from './data-set-list.model';",
        kind: 'class',
        declaration:
          '{\n  total?: number;\n  apis?: {\n  apiKey?: string;\n  ' +
          'apiVersionNumber?: string;\n  apiUrl?: string;\n  ' +
          'apiDocumentationUrl?: string;\n}[];\n}',
        signature: 'DataSetList',
      },
      {
        description: 'AnonymousType_2',
        name: 'AnonymousType_2',
        className: 'AnonymousType2',
        fileName: 'anonymous-type-2.model.ts',
        properties: [],
        imports: [],
        import: "import {AnonymousType2} from './anonymous-type-2.model';",
        declaration: 'string',
        signature: 'AnonymousType2',
      },
      {
        description: 'AnonymousType_3',
        name: 'AnonymousType_3',
        className: 'AnonymousType3',
        fileName: 'anonymous-type-3.model.ts',
        properties: [],
        imports: [],
        import: "import {AnonymousType3} from './anonymous-type-3.model';",
        declaration: 'string',
        signature: 'AnonymousType3',
      },
      {
        description: 'AnonymousType_4',
        name: 'AnonymousType_4',
        className: 'AnonymousType4',
        fileName: 'anonymous-type-4.model.ts',
        properties: [],
        imports: [],
        import: "import {AnonymousType4} from './anonymous-type-4.model';",
        declaration: 'string',
        signature: 'AnonymousType4',
      },
      {
        description: 'AnonymousType_5',
        name: 'AnonymousType_5',
        className: 'AnonymousType5',
        fileName: 'anonymous-type-5.model.ts',
        properties: [],
        imports: [],
        import: "import {AnonymousType5} from './anonymous-type-5.model';",
        declaration: 'string',
        signature: 'AnonymousType5',
      },
      {
        description: 'AnonymousType_6',
        name: 'AnonymousType_6',
        className: 'AnonymousType6',
        fileName: 'anonymous-type-6.model.ts',
        properties: [],
        imports: [],
        import: "import {AnonymousType6} from './anonymous-type-6.model';",
        declaration: 'string',
        signature: 'AnonymousType6',
      },
      {
        description: 'AnonymousType_7',
        name: '{\n  \n}[]',
        className: 'AnonymousType7',
        fileName: 'anonymous-type-7.model.ts',
        properties: [],
        imports: [],
        import: "import {AnonymousType7} from './anonymous-type-7.model';",
        declaration: '{\n  \n}[]',
        signature: 'AnonymousType7',
        itemType: {
          imports: [],
          declaration: '{\n  \n}',
          properties: [],
          signature: '{\n  \n}',
        },
      },
    ]);
  });

  it('generates models for petstore', () => {
    const objectTypeMapping = new Map();
    const models = generateModelSpecs(petstoreSpec, {objectTypeMapping});
    expect(models).to.eql([
      {
        name: 'Pet',
        className: 'Pet',
        fileName: 'pet.model.ts',
        description: 'Pet',
        properties: [],
        imports: ["import {NewPet} from './new-pet.model';"],
        members: [
          {
            name: 'NewPet',
            description: 'NewPet',
            className: 'NewPet',
            fileName: 'new-pet.model.ts',
            kind: 'class',
            properties: [
              {
                name: 'name',
                signature: 'name: string;',
                decoration: "@property({name: 'name'})",
              },
              {
                name: 'tag',
                signature: 'tag?: string;',
                decoration: "@property({name: 'tag'})",
              },
            ],
            imports: [],
            declaration: '{\n  name: string;\n  tag?: string;\n}',
            signature: 'NewPet',
            import: "import {NewPet} from './new-pet.model';",
          },
          {
            declaration: '{\n  id: number;\n}',
            imports: [],
            properties: [
              {
                name: 'id',
                signature: 'id: number;',
                decoration: "@property({name: 'id'})",
              },
            ],
            signature: '{\n  id: number;\n}',
          },
        ],
        declaration: 'NewPet & {\n  id: number;\n}',
        signature: 'Pet',
        import: "import {Pet} from './pet.model';",
      },
      {
        name: 'NewPet',
        description: 'NewPet',
        className: 'NewPet',
        fileName: 'new-pet.model.ts',
        kind: 'class',
        properties: [
          {
            name: 'name',
            signature: 'name: string;',
            decoration: "@property({name: 'name'})",
          },
          {
            name: 'tag',
            signature: 'tag?: string;',
            decoration: "@property({name: 'tag'})",
          },
        ],
        imports: [],
        declaration: '{\n  name: string;\n  tag?: string;\n}',
        signature: 'NewPet',
        import: "import {NewPet} from './new-pet.model';",
      },
      {
        name: 'Error',
        description: 'Error',
        className: 'Error',
        fileName: 'error.model.ts',
        kind: 'class',
        properties: [
          {
            name: 'code',
            signature: 'code: number;',
            decoration: "@property({name: 'code'})",
          },
          {
            name: 'message',
            signature: 'message: string;',
            decoration: "@property({name: 'message'})",
          },
        ],
        imports: [],
        declaration: '{\n  code: number;\n  message: string;\n}',
        signature: 'Error',
        import: "import {Error} from './error.model';",
      },
    ]);
  });

  it('generates models for customer', () => {
    const objectTypeMapping = new Map();
    const models = generateModelSpecs(customerSepc, {objectTypeMapping});
    expect(models).to.eql([
      {
        description: 'Name',
        name: 'Name',
        className: 'Name',
        fileName: 'name.model.ts',
        properties: [],
        imports: [],
        import: "import {Name} from './name.model';",
        declaration: 'string',
        signature: 'Name',
      },
      {
        description: 'Address',
        name: 'Address',
        className: 'Address',
        fileName: 'address.model.ts',
        properties: [
          {
            name: 'street',
            signature: 'street?: string;',
            decoration: "@property({name: 'street'})",
          },
          {
            name: 'city',
            signature: 'city?: string;',
            decoration: "@property({name: 'city'})",
          },
          {
            name: 'state',
            signature: 'state?: string;',
            decoration: "@property({name: 'state'})",
          },
          {
            name: 'zipCode',
            signature: 'zipCode?: string;',
            decoration: "@property({name: 'zipCode'})",
          },
        ],
        imports: [],
        import: "import {Address} from './address.model';",
        kind: 'class',
        declaration:
          '{\n  street?: string;\n  city?: string;\n  state?: string;\n  ' +
          'zipCode?: string;\n}',
        signature: 'Address',
      },
      {
        description: 'Customer',
        name: 'Customer',
        className: 'Customer',
        fileName: 'customer.model.ts',
        properties: [
          {
            name: 'id',
            signature: 'id: number;',
            decoration: "@property({name: 'id'})",
          },
          {
            name: 'first-name',
            signature: "'first-name'?: string;",
            decoration: "@property({name: 'first-name'})",
          },
          {
            name: 'last-name',
            signature: "'last-name'?: Name;",
            decoration: "@property({name: 'last-name'})",
          },
          {
            name: 'addresses',
            signature: 'addresses?: Address[];',
            decoration: "@property.array(Address, {name: 'addresses'})",
          },
        ],
        imports: [
          "import {Name} from './name.model';",
          "import {Address} from './address.model';",
        ],
        import: "import {Customer} from './customer.model';",
        kind: 'class',
        declaration:
          "{\n  id: number;\n  'first-name'?: string;\n  'last-name'?: " +
          'Name;\n  addresses?: Address[];\n}',
        signature: 'Customer',
      },
    ]);
  });
});
