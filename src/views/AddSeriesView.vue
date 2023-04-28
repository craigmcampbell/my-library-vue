<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Components
import Breadcrumb from '@/components/Breadcrumb.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import PageTitle from '@/components/PageTitle.vue';
import SuccessMessage from '@/components/SuccessMessage.vue';

// Helpers & Services
import { get, post } from '@/services/axiosService';

// Models
import type AddSeriesDto from '@/models/series/AddSeriesDto.interface';
import type Author from '@/models/author/Author.interface';
import type IBreadcrumb from '@/models/breadcrumb.interface';
import type SelectOption from '@/models/selectoption.interface';

const crumbs: IBreadcrumb[] = [
  {
    pathName: 'series',
    title: 'Series',
  },
  {
    title: 'Add New Series',
  },
];

const addNewAuthor = ref(false);
const isSuccess = ref(false);
const errorMsg = ref<string | null>(null);

const authors = ref<SelectOption[]>([]);
const series = ref<AddSeriesDto>({
  name: '',
  numberOfBooks: null,
  authorId: '',
  authorFirstName: '',
  authorLastName: '',
});

// Events
onMounted(async () => {
  const allAuthors = await get<Author[]>('authors');
  authors.value = allAuthors.map((a) => {
    return {
      value: a.id,
      text: `${a.lastName}, ${a.firstName}`,
    };
  });
});

const addNewAuthorClicked = () => {
  addNewAuthor.value = !addNewAuthor.value;
};

const sendForm = async () => {
  try {
    isSuccess.value = false;
    errorMsg.value = null;

    const { authorFirstName, authorId, authorLastName, name, numberOfBooks } = series.value;

    await post('series', {
      authorFirstName,
      authorId,
      authorLastName,
      name,
      numberOfBooks: Number(numberOfBooks),
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
</script>

<template>
  <Breadcrumb :crumbs="crumbs" />

  <PageTitle>{{ crumbs[crumbs.length - 1].title }}</PageTitle>

  <div class="flex justify-center">
    <form @submit.prevent="sendForm">
      <SuccessMessage v-show="isSuccess" header="New Series was Added" />
      <ErrorMessage v-if="errorMsg" :header="errorMsg" />

      <BaseInput v-model="series.name" label="Series Name" type="text" />

      <BaseSelect :options="authors" v-model="series.authorId" label="Select an Author" />

      <div>
        <button
          v-if="!addNewAuthor"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mb-4"
          type="button"
          @click="addNewAuthorClicked"
        >
          Add New Author
        </button>
      </div>

      <BaseInput v-if="addNewAuthor" v-model="series.authorFirstName" label="New Author First Name" type="text" />

      <BaseInput v-if="addNewAuthor" v-model="series.authorLastName" label="New Author Last Name" type="text" />

      <BaseInput v-model="series.numberOfBooks" label="Number of Books" type="number" />

      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">Save</button>
    </form>
  </div>
</template>

<style scoped>
form {
  width: 600px;
  justify-content: center;
}
</style>
