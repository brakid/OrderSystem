
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "./schema.graphql",
  generates: {
    "src/gql/resolvers-types.ts": {
      plugins: ["typescript", "typescript-resolvers", "typescript-operations"],
      config: {
        useIndexSignature: true,
        useTypeImports: true
      }
    }
  }
};

export default config;
