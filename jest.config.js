// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Forneça o caminho para o seu aplicativo Next.js para carregar next.config.js e .env no ambiente de teste
  dir: './',
});

// Adicione quaisquer configurações personalizadas do Jest a serem passadas para o Jest
const customJestConfig = {
  // Adicione mais opções de setupFilesAfterEnv aqui se necessário
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'node',
  // Se você estiver usando aliases de módulo (modulePathPatterns) ou baseUrl no tsconfig.json/jsconfig.json,
  // você precisará configurar o moduleNameMapper no Jest.
  moduleNameMapper: {
    // Exemplo para aliases de módulo (ajuste conforme sua configuração)
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
    // Lidar com módulos CSS
    '^.+\\.(css|sass|scss)$': 'identity-obj-proxy',
  },
  // Se você estiver usando TypeScript com um baseUrl configurado no tsconfig.json
  // moduleDirectories: ['node_modules', '<rootDir>/'],
};

// createJestConfig é exportado desta forma para garantir que next/jest possa carregar a configuração do Next.js corretamente
module.exports = createJestConfig(customJestConfig);