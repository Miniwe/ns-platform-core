module.exports = {
  forbidden: [
    /* --- 1. ЦИКЛИЧЕСКИЕ ЗАВИСИМОСТИ --- */
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'Запрещены циклические зависимости между файлами',
      from: {
        // Проверяем циклы только для вашего кода
        pathNot: ['^node_modules', '^\\.\\./node_modules'],
      },
      to: {
        circular: true,
        // Исключаем попадание node_modules в цепочку цикла
        pathNot: ['^node_modules', '^\\.\\./node_modules'],
      },
    },

    /* --- 2. КОНТРОЛЬ СЛОЕВ ВНУТРИ МОДУЛЯ --- */
    {
      name: 'domain-no-dependencies',
      severity: 'error',
      comment:
        'Слой DOMAIN должен быть чистым. Запрещены импорты из infrastructure, application и interface.',
      from: { path: '^src/modules/[^/]+/domain' },
      to: {
        path: '^src/modules/[^/]+/(infrastructure|application|interface)',
        // Разрешаем домену импортировать типы/сервисы из глобальных модулей, если необходимо
        pathNot: '^src/modules/(global-config|logger)/',
      },
    },
    {
      name: 'application-no-interface',
      severity: 'error',
      comment: 'Слой APPLICATION не должен зависеть от внешнего интерфейса',
      from: { path: '^src/modules/[^/]+/application' },
      to: { path: '^src/modules/[^/]+/interface' },
    },
    {
      name: 'infrastructure-no-interface',
      severity: 'error',
      comment: 'Слой INFRASTRUCTURE не должен зависеть от интерфейса',
      from: { path: '^src/modules/[^/]+/infrastructure' },
      to: { path: '^src/modules/[^/]+/interface' },
    },

    /* --- 3. ИЗОЛЯЦИЯ МОДУЛЕЙ И PUBLIC API (BARREL FILES) --- */
    // Строгое правило для сервисов, контроллеров и интерфейсов
    {
      name: 'enforce-public-api',
      severity: 'error',
      comment: 'Прикладной и интерфейсный слои обязаны использовать только Public API соседа.',
      // Запускаем проверку для всего, кроме папки domain
      from: { path: '^src/modules/([^/]+)/(?!domain/)' },
      to: {
        path: '^src/modules/(?!$1)([^/]+)/.+',
        pathNot: ['^src/modules/(?!$1)([^/]+)/index\\.ts$', '^src/modules/(global-config|logger)/'],
      },
    },

    // Изолированное послабление ТОЛЬКО для доменного слоя
    {
      name: 'allow-direct-domain-communication',
      severity: 'error',
      comment: 'Доменам разрешено общаться с доменами соседей напрямую во избежание ESM-циклов.',
      from: { path: '^src/modules/([^/]+)/domain/' }, // Строго ИЗ папки domain
      to: {
        path: '^src/modules/(?!$1)([^/]+)/.+',
        pathNot: [
          '^src/modules/(?!$1)([^/]+)/index\\.ts$',
          '^src/modules/(global-config|logger)/',
          '^src/modules/[^/]+/domain/.+', // Строго В папку domain соседа
        ],
      },
    },
    {
      name: 'no-cross-module-entities',
      severity: 'error',
      comment: 'Прямой импорт TypeORM-сущностей из других модулей строго запрещен.',
      from: { path: '^src/modules/([^/]+)' },
      to: {
        path: '^src/modules/(?!$1)[^/]+/infrastructure/.+\\.entity\\.ts',
      },
    },

    /* --- 4. ЧИСТОТА SHARED СЛОЯ --- */
    {
      name: 'shared-no-modules',
      severity: 'error',
      comment:
        'Общие утилиты (shared/common) не могут импортировать бизнес-модули, кроме глобальных.',
      from: { path: '^src/(shared|common)' },
      to: {
        path: '^src/modules',
        // Разрешаем слою shared импортировать глобальные модули конфигурации или логирования
        pathNot: '^src/modules/(global-config|logger)/',
      },
    },
  ],
  options: {
    doNotFollow: {
      path: ['node_modules', 'dist', '\\.spec\\.ts$', '\\.husky'],
    },
    exclude: {
      path: ['node_modules', 'dist', '\\.spec\\.ts$', '\\.husky'],
    },
    tsConfig: {
      fileName: 'tsconfig.json',
    },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['node', 'import', 'require'],
    },
  },
};
