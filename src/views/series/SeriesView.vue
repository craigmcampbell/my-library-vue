<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useLazyQuery, useMutation, useQuery } from '@vue/apollo-composable';
import ALL_SERIES_QUERY from '@/graphql/series/allSeries.query.gql';
import DELETE_SERIES_MUTATION from '@/graphql/series/deleteSeries.mutation.gql';
import SEARCH_SERIES_BY_NAME_QUERY from '@/graphql/series/searchSeriesByName.query.gql';

// Components
import Breadcrumb from '@/components/Breadcrumb.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import LinkButton from '@/components/LinkButton.vue';
import PageTitle from '@/components/PageTitle.vue';

// Models
import type GetSeriesDto from '@/models/get-series.dto';
import type BreadcrumbModel from '@/models/breadcrumb.interface';
import type { ApolloError } from '@apollo/client';

const crumbs = ref<BreadcrumbModel[]>([
  {
    title: 'Series',
  },
]);

const allSeries = ref<GetSeriesDto[]>([]);
const apolloError = ref<ApolloError | null>(null);
const errorMsg = ref<string | null>(null);
const searchResults = ref<GetSeriesDto[]>([]);
const searchTerm = ref('');
const showAll = ref(false);

const { onResult: onAllSeriesResult, onError: onAllSeriesError, load: getAllSeries } = useLazyQuery(ALL_SERIES_QUERY);
const { onError: onDeleteSeriesError, mutate: deleteSeries } = useMutation(DELETE_SERIES_MUTATION, {
  refetchQueries: [{ query: ALL_SERIES_QUERY }],
});

try {
  const { onResult: onSearchResult, onError: onSearchError } = useQuery(
    SEARCH_SERIES_BY_NAME_QUERY,
    () => ({
      name: searchTerm.value,
    }),
    () => ({
      debounce: 500,
      enabled: searchTerm.value.length > 2,
    }),
  );

  onSearchResult((queryResult) => {
    searchResults.value = queryResult.data?.searchSeriesByName;
  });

  onSearchError((error) => {
    apolloError.value = error;
  });

  onDeleteSeriesError((error) => {
    apolloError.value = error;
  });

  onAllSeriesResult((queryResult) => {
    allSeries.value = queryResult.data?.getAllSeries;
  });

  onAllSeriesError((error) => {
    apolloError.value = error;
  });
} catch (error: any) {
  errorMsg.value = error.message;
}

watchEffect(() => {
  searchTerm.value = '';

  if (showAll.value) {
    getAllSeries();
  } else {
    searchResults.value = [];
  }
});

const seriesList = computed((): GetSeriesDto[] => {
  return showAll.value ? allSeries.value : searchResults.value;
});

const errorDisplay = computed(() => {
  if (apolloError.value) {
    return apolloError.value.message;
  }
  if (errorMsg.value) {
    return errorMsg.value;
  }
  return null;
});

const reset = () => {
  searchTerm.value = '';
  showAll.value = false;
  searchResults.value = [];
};

const onDeleteClick = (id: string) => {
  deleteSeries({ id });
};
</script>

<template>
  <Breadcrumb :crumbs="crumbs" />

  <PageTitle>All Series</PageTitle>

  <ErrorMessage v-if="errorDisplay" :header="errorDisplay" />

  <LinkButton class="mb-10" route-name="add-series">+ Add New Series</LinkButton>

  <div class="grid grid-cols-2 gap-6 border-2 mb-3 p-2 border-blue-400">
    <div>
      <BaseInput v-model="searchTerm" label="Search by series name" />
    </div>
    <div>
      <BaseCheckbox v-model="showAll" label="Show All Series" />

      <div>
        <button @click="reset" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3">
          Reset
        </button>
      </div>
    </div>
  </div>

  <div class="relative overflow-x-auto">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">Series Title</th>
          <th scope="col" class="px-6 py-3">Author</th>
          <th scope="col" class="px-6 py-3">Number of Books</th>
          <th scope="col" class="px-6 py-3"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-if="seriesList"
          v-for="s in seriesList"
          :key="s.id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
        >
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            <RouterLink :to="{ name: 'edit-series', params: { id: s.id } }" class="text-blue-500">
              {{ s.name }}
            </RouterLink>
          </th>
          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {{ `${s.author.firstName}, ${s.author.lastName}` }} TODO
          </td>
          <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{{ s.numberOfBooks }}</td>
          <td @click="onDeleteClick(s.id)" style="cursor: pointer" :title="'Delete ' + s.name" class="text-red-500">
            X
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>
