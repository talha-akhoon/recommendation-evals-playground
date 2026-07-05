import type { Scenario } from '../types/eval.types.js';

export const frameworksScenario: Scenario = {
  id: 'frontend-frameworks',
  name: 'Frontend framework for a SaaS dashboard',
  description:
    'Choose a frontend JavaScript framework for a new SaaS dashboard product.',
  options: [
    {
      id: 'react',
      name: 'React',
      evidence: [
        {
          id: 'react_spec_001',
          text: 'React is a JavaScript library maintained by Meta. It uses JSX and a virtual DOM. It has the largest ecosystem of any frontend framework, with thousands of third-party components and libraries.',
        },
        {
          id: 'react_spec_002',
          text: 'React requires additional libraries for routing (e.g. React Router) and state management (e.g. Zustand, Redux). The total dependency footprint adds to bundle size compared to all-in-one frameworks.',
        },
        {
          id: 'react_review_001',
          text: 'React has the highest demand in the job market. Most frontend job postings list React as a requirement or a preferred skill.',
        },
        {
          id: 'react_review_002',
          text: "React's learning curve can be steep due to JSX, hooks, and a fragmented ecosystem. New developers often need to make multiple architectural decisions before writing business logic.",
        },
      ],
    },
    {
      id: 'vue',
      name: 'Vue',
      evidence: [
        {
          id: 'vue_spec_001',
          text: 'Vue is a progressive framework with a gentle learning curve. It uses single-file components with co-located HTML templates, JavaScript logic, and scoped CSS.',
        },
        {
          id: 'vue_spec_002',
          text: 'Vue includes first-party solutions for routing and state management via Vue Router and Pinia. The ecosystem is more opinionated and cohesive than React.',
        },
        {
          id: 'vue_review_001',
          text: 'Vue is particularly popular in Asia and in teams coming from an HTML background. Its template syntax is closer to standard HTML than JSX.',
        },
        {
          id: 'vue_review_002',
          text: "Vue's ecosystem is smaller than React's. Fewer third-party component libraries are available and finding Vue-specialist developers is harder than finding React developers.",
        },
      ],
    },
    {
      id: 'svelte',
      name: 'Svelte',
      evidence: [
        {
          id: 'svelte_spec_001',
          text: 'Svelte compiles to vanilla JavaScript with no virtual DOM overhead. Its bundle sizes are consistently smaller than React and Vue in benchmarks, and runtime performance is strong.',
        },
        {
          id: 'svelte_spec_002',
          text: "Svelte's syntax requires less boilerplate than React. Reactivity is built into the language without requiring explicit hooks or manual state wrappers.",
        },
        {
          id: 'svelte_review_001',
          text: 'Svelte has a small but growing ecosystem. Third-party component availability is limited compared to React or Vue.',
        },
        {
          id: 'svelte_review_002',
          text: "The Svelte job market is significantly smaller than React's. Teams adopting Svelte may face challenges hiring or finding community support at scale.",
        },
      ],
    },
  ],
};
