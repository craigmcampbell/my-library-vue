import { createApp, provide, h } from 'vue';
import { createPinia } from 'pinia';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { ApolloClient, InMemoryCache } from '@apollo/client/core';

import App from './App.vue';
import router from './router';

import './assets/main.css';

// Set Up GraphQL Client
const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  cache,
  // uri: 'https://rickandmortyapi.com/graphql',
  uri: 'http://localhost:3000/graphql',
});

// Global Components
import BaseCheckbox from './components/Forms/BaseCheckbox.vue';
import BaseInput from './components/Forms/BaseInput.vue';
import BaseRadio from './components/Forms/BaseRadio.vue';
import BaseRadioGroup from './components/Forms/BaseRadioGroup.vue';
import BaseSelect from './components/Forms/BaseSelect.vue';

// const app = createApp(App);

const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient);
  },

  render: () => h(App),
});

app.component('BaseCheckbox', BaseCheckbox);
app.component('BaseInput', BaseInput);
app.component('BaseRadio', BaseRadio);
app.component('BaseRadioGroup', BaseRadioGroup);
app.component('BaseSelect', BaseSelect);

app.use(createPinia());
app.use(router);

app.mount('#app');
