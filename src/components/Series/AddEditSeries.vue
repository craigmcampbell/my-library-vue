<script setup lang="ts">
import { useQuery } from '@vue/apollo-composable';
import type { ApolloError } from '@apollo/client';
import { computed, ref } from 'vue';

import type Author from '@/models/author/Author.interface';
import type AddSeriesDto from '@/models/series/AddSeriesDto.interface';
import type EditSeriesDto from '@/models/series/EditSeriesDto.interface';
import type SelectOption from '@/models/selectoption.interface';
import GET_ALL_AUTHORS from '@/graphql/author/allAuthors.query.gql';

export interface AddEditSeriesProps {
  authorFirstName?: string | undefined;
  authorId?: string;
  authorLastName?: string | undefined;
  id?: string | undefined;
  name: string;
  numberOfBooks: null | number;
}

const props = defineProps({
  mode: {
    type: String as () => 'add' | 'edit',
    required: true,
  },
  series: {
    type: Object as () => AddEditSeriesProps,
  },
});

const addNewAuthor = ref(false);
const apolloError = ref<ApolloError | null>(null);
const emit = defineEmits(['saveForm']);

const activeSeries = ref<AddEditSeriesProps>({
  authorFirstName: props.series?.authorFirstName ?? '',
  authorId: props.series?.authorId ?? '',
  authorLastName: props.series?.authorLastName ?? '',
  id: props.series?.id ?? '',
  name: props.series?.name ?? '',
  numberOfBooks: props.series?.numberOfBooks ?? null,
});

const { result: allAuthorsResult, onError } = useQuery(GET_ALL_AUTHORS);

const authorOptionsList = computed((): SelectOption[] => {
  if (!allAuthorsResult.value?.getAllAuthors) return [];

  return allAuthorsResult.value?.getAllAuthors.map((a: Author) => {
    return {
      value: a.id,
      text: `${a.lastName}, ${a.firstName}`,
    };
  });
});

onError((error) => {
  apolloError.value = error;
});

const saveForm = () => {
  if (props.mode === 'add') {
    const seriesDto: AddSeriesDto = {
      authorFirstName: activeSeries?.value.authorFirstName ?? '',
      authorLastName: activeSeries?.value.authorLastName ?? '',
      name: activeSeries.value.name,
      numberOfBooks: activeSeries.value.numberOfBooks,
      authorId: activeSeries.value?.authorId ?? '',
    };

    emit('saveForm', seriesDto);
  }

  if (props.mode === 'edit') {
    const seriesDto: EditSeriesDto = {
      id: activeSeries.value?.id ?? '',
      name: activeSeries.value.name,
      numberOfBooks: activeSeries.value.numberOfBooks,
      authorId: activeSeries.value?.authorId ?? '',
    };

    emit('saveForm', seriesDto);
  }
};

const addNewAuthorClicked = () => {
  addNewAuthor.value = !addNewAuthor.value;
};

const errorDisplay = computed(() => {
  if (apolloError.value) {
    return apolloError.value.message;
  }
  return null;
});
</script>

<template>
  <form @submit.prevent="saveForm">
    <ErrorMessage v-if="errorDisplay" :header="errorDisplay" />

    <BaseInput v-model="activeSeries.name" label="Series Name" type="text" />

    <BaseSelect :options="authorOptionsList" v-model="activeSeries.authorId" label="Select an Author" />

    <div>
      <button
        v-if="!addNewAuthor && mode === 'add'"
        class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mb-4"
        type="button"
        @click="addNewAuthorClicked"
      >
        Add New Author
      </button>
    </div>

    <BaseInput
      v-if="addNewAuthor && mode === 'add'"
      v-model="activeSeries.authorFirstName"
      label="New Author First Name"
      type="text"
    />

    <BaseInput
      v-if="addNewAuthor && mode === 'add'"
      v-model="activeSeries.authorLastName"
      label="New Author Last Name"
      type="text"
    />

    <BaseInput v-model="activeSeries.numberOfBooks" label="Number of Books" type="number" />

    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Save</button>
  </form>
</template>

<style scoped></style>
