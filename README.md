# vue-project

Aplicação desenvolvida como solução para o Desafio Técnico Vue.js (Mobile – Nível Júnior), com foco em clareza de código, organização e boas práticas do ecossistema Vue.

O projeto simula um pequeno dashboard de status do GitHub, incluindo autenticação mockada, leitura de parâmetros de URL para exibição de popup de boas-vindas, atualização periódica e manual dos dados, filtros e alteração de tema. A implementação prioriza uma abordagem mobile-first, simplicidade arquitetural e baixo acoplamento, buscando refletir decisões próximas ao dia a dia de projetos reais.

---

## 🚀 Como rodar o projeto

### Instalar dependências

```sh
pnpm install
```

### Rodar em ambiente de desenvolvimento

```sh
pnpm run dev
```

### Build para produção

```sh
pnpm run build
```

---

## 🧠 Decisões Técnicas

### 🔹 Simplicidade e controle

- Decidi **não utilizar uma component library (como shadcn)** para manter o projeto mais simples, com menos dependências e maior controle sobre a implementação.
- Isso também permitiu exercitar melhor o Vue sem muitas abstrações.

### 🔹 Estratégia de ícones

- Optei por **não usar bibliotecas de ícones (como Lucide)**.
- Em vez disso:
  - Baixei os SVGs manualmente
  - Removi atributos de tamanho hardcoded
  - Utilizei o plugin `vite-svg-loader`

Exemplo de uso:

```ts
import RefreshIcon from '@/assets/icons/refresh-ccw.svg?component'
```

- Isso permite tratar SVGs como componentes Vue, aplicando classes e estilos dinamicamente.

### 🔹 Organização com composables

- Criei uma pasta `composables` para centralizar lógica reutilizável:
  - `useTheme`
  - `useStatusData`

- Objetivo:
  - Reduzir duplicação (DRY - Don't Repeat Yourself)
  - Manter páginas mais limpas e focadas em UI

### 🔹 Estilização com Tailwind

- Escolhi utilizar **TailwindCSS** pela:
  - Versatilidade
  - Rapidez no desenvolvimento
  - Facilidade para aplicar css moderno

- Também investi na criação de um **tema customizado no `main.css`**, utilizando:
  - Tokens de design
  - Estilos base para componentes

- Isso facilitou:
  - Consistência visual
  - Implementação de tema (ex: dark mode)

### 🔹 Separação de responsabilidades

- Criei uma pasta `services` com o `githubService`, responsável exclusivamente por:
  - Fazer requisições à API do GitHub

- Outras melhorias estruturais:
  - Tipos e interfaces separados em `/types`
  - Constantes em `/constants`

### 🔹 Deploy e roteamento

- Adicionei o arquivo `_redirects` na raiz do projeto

- Objetivo:
  - Garantir que o roteamento funcione corretamente no deploy via Netlify (SPA fallback)

---

## 🛠️ Recommended IDE Setup

- VS Code + Extensão Vue (Official) + Vue 3 Snippets + Prettier

---
