'use strict';

/* eslint-disable no-bitwise */

const ts = require('typescript');
const { factory } = require('typescript');

const { getSchemaInterfaceName } = require('./utils');
const { serviceToPropertySignature } = require('./services');

/**
 *
 * @param {object} schemaDefinition
 * @param {ts.InterfaceDeclaration} schemaDefinition.definition
 * @param {object} schemaDefinition.schema
 */
const schemaDefinitionToPropertySignature = ({ schema }) => {
  const { uid } = schema;

  const interfaceTypeName = getSchemaInterfaceName(uid);

  return factory.createPropertySignature(
    undefined,
    factory.createStringLiteral(uid, true),
    undefined,
    factory.createTypeReferenceNode(factory.createIdentifier(interfaceTypeName))
  );
};

/**
 *
 * @param {object} schemaDefinition
 * @param {ts.InterfaceDeclaration} schemaDefinition.definition
 * @param {object} schemaDefinition.schema
 */
const schemaDefinitionToPropertySignatureWithAttributes = ({ schema }) => {
  const { uid, attributes } = schema;
  return factory.createPropertySignature(
    undefined,
    factory.createStringLiteral(uid, true),
    undefined,
    factory.createTypeLiteralNode(
      Object.keys(attributes)
        .map((key) =>
          factory.createPropertySignature(
            undefined,
            factory.createStringLiteral(key, true),
            undefined,
            factory.createTypeReferenceNode(
              factory.createIdentifier(
                getSchemaInterfaceName(attributes[key].type) + 'AttributeType'
              )
            )
          )
        )
        .concat(
          factory.createPropertySignature(
            undefined,
            factory.createStringLiteral('id', true),
            undefined,
            factory.createTypeReferenceNode(factory.createIdentifier('IntegerAttributeType'))
          )
        )
    )
  );
};

/**
 * Generate the global module augmentation block
 *
 * @param {Array<{ schema: object; definition: ts.TypeNode }>} schemasDefinitions
 * @param {import('@strapi/strapi').Strapi} strapi
 * @returns {ts.ModuleDeclaration}
 */
const generateGlobalDefinition = (schemasDefinitions = [], strapi) => {
  const properties = schemasDefinitions.map(schemaDefinitionToPropertySignature);
  const propertiesWithAttributes = schemasDefinitions.map(
    schemaDefinitionToPropertySignatureWithAttributes
  );

  return factory.createModuleDeclaration(
    [factory.createModifier(ts.SyntaxKind.DeclareKeyword)],
    factory.createIdentifier('global'),
    factory.createModuleBlock([
      factory.createModuleDeclaration(
        undefined,
        factory.createIdentifier('Strapi'),
        factory.createModuleBlock([
          factory.createInterfaceDeclaration(
            undefined,
            factory.createIdentifier('Schemas'),
            undefined,
            undefined,
            properties
          ),
        ]),
        ts.NodeFlags.Namespace |
          ts.NodeFlags.ExportContext |
          ts.NodeFlags.Ambient |
          ts.NodeFlags.ContextFlags
      ),
      factory.createInterfaceDeclaration(
        undefined,
        factory.createIdentifier('AllTypes'),
        undefined,
        undefined,
        propertiesWithAttributes
      ),
      factory.createInterfaceDeclaration(
        undefined,
        factory.createIdentifier('AllServices'),
        undefined,
        undefined,
        serviceToPropertySignature(strapi)
      ),
    ]),
    ts.NodeFlags.ExportContext |
      ts.NodeFlags.GlobalAugmentation |
      ts.NodeFlags.Ambient |
      ts.NodeFlags.ContextFlags
  );
};

module.exports = { generateGlobalDefinition };
