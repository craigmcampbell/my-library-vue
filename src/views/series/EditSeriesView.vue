<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import { useMutation, useQuery } from '@vue/apollo-composable';
import ALL_SERIES_QUERY from '@/graphql/series/allSeries.query.gql';
import GET_SERIES_BY_ID_QUERY from '@/graphql/series/getSeriesById.query.gql';
import UPDATE_SERIES_MUTATION from '@/graphql/series/updateSeries.mutation.gql';

// Components
import AddEditSeries from '@/components/Series/AddEditSeries.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import PageTitle from '@/components/PageTitle.vue';

// Models
import type BreadcrumbModel from '@/models/breadcrumb.interface';
import type { ApolloError } from '@apollo/client';
import type EditSeriesDto from '@/models/series/EditSeriesDto.interface';
import type { AddEditSeriesProps } from '@/components/Series/AddEditSeries.vue';

const crumbs: BreadcrumbModel[] = [
  {
    pathName: 'series',
    title: 'Series',
  },
  {
    title: 'Edit Series',
  },
];

const route = useRoute();
const seriesId = route.params.id as string;

const apolloError = ref<ApolloError | null>(null);
const series = ref<AddEditSeriesProps>({
  authorId: '',
  id: seriesId,
  name: '',
  numberOfBooks: null,
});

const {
  onError: onGetSeriesError,
  onResult: onSeriesResult,
  loading,
} = useQuery(GET_SERIES_BY_ID_QUERY, {
  id: seriesId,
});

const { mutate: updateSeries, onError: onUpdateSeriesError } = useMutation(UPDATE_SERIES_MUTATION, {
  refetchQueries: [{ query: ALL_SERIES_QUERY }],
});

onSeriesResult((queryResult) => {
  series.value = {
    authorId: queryResult.data?.getSeriesById.authorId,
    id: queryResult.data?.getSeriesById.id,
    name: queryResult.data?.getSeriesById.name,
    numberOfBooks: queryResult.data?.getSeriesById.numberOfBooks,
  };
});

onGetSeriesError((error) => {
  apolloError.value = error;
});

onUpdateSeriesError((error) => {
  apolloError.value = error;
});

const handleSaveClick = (data: EditSeriesDto) => {
  const { authorId, id, name, numberOfBooks } = data;

  updateSeries({
    series: {
      authorId,
      id,
      name,
      numberOfBooks: Number(numberOfBooks),
    },
  });

  if (!errorDisplay.value || errorDisplay.value?.length === 0) {
    router.push({ name: 'series' });
  }
};

const errorDisplay = computed((): string | null => {
  if (apolloError.value) {
    return apolloError.value.message;
  }

  return null;
});
</script>

<template>
  <Breadcrumb :crumbs="crumbs" />

  <PageTitle>{{ crumbs[crumbs.length - 1].title }}</PageTitle>

  <div class="flex justify-center">
    <div class="formContent">
      <ErrorMessage v-if="errorDisplay" :header="errorDisplay" />
      <AddEditSeries v-if="!loading" :series="series" @save-form="handleSaveClick" mode="edit" />
    </div>
  </div>
</template>

<style scoped>
.formContent {
  width: 600px;
}
</style>
