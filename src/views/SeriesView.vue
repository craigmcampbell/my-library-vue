<script setup lang="ts">
import gql from 'graphql-tag';
import { ref, computed } from 'vue';
import { useQuery } from '@vue/apollo-composable';

// Components
import Breadcrumb from '@/components/Breadcrumb.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import LinkButton from '@/components/LinkButton.vue';
import PageTitle from '@/components/PageTitle.vue';

// Models
import type GetSeriesDto from '@/models/get-series.dto';
import type IBreadcrumb from '@/models/breadcrumb.interface';
import type { ApolloError } from '@apollo/client';

const series = ref<GetSeriesDto[]>([]);
const apolloError = ref<ApolloError | null>(null);
const errorMsg = ref<string | null>(null);

const crumbs = ref<IBreadcrumb[]>([
  {
    title: 'Series',
  },
]);

const SERIES_QUERY = gql`
  query GetAllSeries {
    getAllSeries {
      id
      authorId
      name
      numberOfBooks
      author {
        firstName
        lastName
      }
    }
  }
`;

try {
  const { result, loading, error, onResult, onError } = useQuery(SERIES_QUERY);
  series.value = result.value?.getAllSeries;
  apolloError.value = error.value;

  onResult((queryResult) => {
    series.value = queryResult.data?.getAllSeries;
  });

  onError((error) => {
    apolloError.value = error;
  });
} catch (error: any) {
  errorMsg.value = error.message;
}

const errorDisplay = computed(() => {
  if (apolloError.value) {
    return apolloError.value.message;
  }
  if (errorMsg.value) {
    return errorMsg.value;
  }
  return null;
});
</script>

<template>
  <Breadcrumb :crumbs="crumbs" />

  <PageTitle>All Series</PageTitle>

  <ErrorMessage v-if="errorDisplay" :header="errorDisplay" />

  <LinkButton class="mb-3" route-name="add-series">+ Add New Series</LinkButton>

  <div class="relative overflow-x-auto">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">Series Title</th>
          <th scope="col" class="px-6 py-3">Author</th>
          <th scope="col" class="px-6 py-3">Number of Books</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="series" v-for="s in series" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{ s.name }} TODO
          </th>
          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{ `${s.author.firstName}, ${s.author.lastName}` }} TODO
          </td>
          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ s.numberOfBooks }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
