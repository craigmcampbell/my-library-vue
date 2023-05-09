import { createApp, h, provide } from 'vue';
import { createPinia } from 'pinia';
import { DefaultApolloClient } from '@vue/apollo-composable';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client/core';

import App from './App.vue';
import router from './router';

import './assets/main.css';

// Set Up GraphQL Client
const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL;
const cache = new InMemoryCache();

const httpLink = createHttpLink({
  uri: graphqlUrl,
});

const apolloClient = new ApolloClient({
  cache,
  link: httpLink,
});

// Global Components
import BaseCheckbox from './components/Forms/BaseCheckbox.vue';
import BaseInput from './components/Forms/BaseInput.vue';
import BaseRadio from './components/Forms/BaseRadio.vue';
import BaseRadioGroup from './components/Forms/BaseRadioGroup.vue';
import BaseSelect from './components/Forms/BaseSelect.vue';

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
