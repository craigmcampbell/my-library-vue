<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import ADD_SERIES_MUTATION from '@/graphql/series/addSeries.mutation.gql';
import ALL_SERIES_QUERY from '@/graphql/series/allSeries.query.gql';

// Components
import AddEditSeries from '@/components/Series/AddEditSeries.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import PageTitle from '@/components/PageTitle.vue';
import SuccessMessage from '@/components/SuccessMessage.vue';

// Models
import type AddSeriesDto from '@/models/series/AddSeriesDto.interface';
import type BreadcrumbModel from '@/models/breadcrumb.interface';
import type { ApolloError } from '@apollo/client';

const crumbs: BreadcrumbModel[] = [
  {
    pathName: 'series',
    title: 'Series',
  },
  {
    title: 'Add New Series',
  },
];

const addNewAuthor = ref(false);
const apolloError = ref<ApolloError | null>(null);
const errorMsg = ref<string | null>(null);
const isSuccess = ref(false);
const series = ref<AddSeriesDto>({
  name: '',
  numberOfBooks: null,
  authorId: '',
  authorFirstName: '',
  authorLastName: '',
});

const { mutate: addSeries, onError: onAddSeriesError } = useMutation(ADD_SERIES_MUTATION, {
  refetchQueries: [{ query: ALL_SERIES_QUERY }],
});

onAddSeriesError((error) => {
  apolloError.value = error;
});

const handleSaveClick = async (data: AddSeriesDto) => {
  console.info(`data: ${JSON.stringify(data)}`);
  const { authorFirstName, authorId, authorLastName, name, numberOfBooks } = data;

  try {
    await addSeries({
      series: {
        authorFirstName,
        authorId,
        authorLastName,
        name,
        numberOfBooks: Number(numberOfBooks),
      },
    });

    isSuccess.value = true;
    addNewAuthor.value = false;
    series.value = {
      name: '',
      numberOfBooks: null,
      authorId: '',
      authorFirstName: '',
      authorLastName: '',
    };
  } catch (error: any) {
    errorMsg.value = error.message;
  }
};

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

  <PageTitle>{{ crumbs[crumbs.length - 1].title }}</PageTitle>

  <div class="flex justify-center">
    <div class="formContent">
      <SuccessMessage v-show="isSuccess" header="New Series was Added" />
      <ErrorMessage v-if="errorDisplay" :header="errorDisplay" />
      <AddEditSeries :series="series" @save-form="handleSaveClick" mode="add" />
    </div>
  </div>
</template>

<style scoped>
.formContent {
  width: 600px;
}
</style>
