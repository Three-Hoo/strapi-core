const ts = require('typescript');
const factory = ts.factory;

/**
 *
 * @param {import('@strapi/strapi').Strapi} strapi
 */
exports.serviceToPropertySignature = (strapi) => {
  const properties = Object.entries(strapi.services).map(([serviceName, service]) => {
    return factory.createPropertySignature(
      undefined,
      factory.createStringLiteral(serviceName, true),
      undefined,
      factory.createTypeLiteralNode(
        Object.keys(service).map((key) => {
          return factory.createPropertySignature(
            undefined,
            factory.createStringLiteral(key, true),
            undefined,
            factory.createFunctionTypeNode(
              undefined,
              [
                factory.createParameterDeclaration(
                  undefined,
                  factory.createToken(ts.SyntaxKind.DotDotDotToken),
                  factory.createIdentifier('args'),
                  undefined,
                  factory.createArrayTypeNode(
                    factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword)
                  )
                ),
              ],
              factory.createUnionTypeNode([
                factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
                factory.createTypeReferenceNode('Promise', [
                  factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
                ]),
              ])
            )
          );
        })
      )
    );
  });

  return properties;
};
