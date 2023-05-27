'use strict';

const { factory } = require('typescript');

const imports = [];
const typeImports = [];

module.exports = {
  getImports(importTypes = 'imports') {
    return importTypes === 'imports' ? imports : typeImports;
  },

  addImport(type, importTypes = 'imports') {
    let _imports = importTypes === 'imports' ? imports : typeImports;
    const hasType = _imports.includes(type);

    if (!hasType) {
      _imports.push(type);
    }
  },

  generateImportDefinition(importTypes = 'imports') {
    const _imports = importTypes === 'imports' ? imports : typeImports;
    const formattedImports = _imports.map((key) =>
      factory.createImportSpecifier(false, undefined, factory.createIdentifier(key))
    );

    return factory.createImportDeclaration(
      undefined,
      factory.createImportClause(false, undefined, factory.createNamedImports(formattedImports)),
      factory.createStringLiteral(
        importTypes === 'imports' ? '@strapi/strapi' : './typing.d.ts',
      ),
      undefined
    );
  },
};
