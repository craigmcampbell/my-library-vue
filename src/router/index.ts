import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import SeriesView from '../views/series/SeriesView.vue';
import AddSeriesView from '../views/series/AddSeriesView.vue';
import EditSeriesView from '../views/series/EditSeriesView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    ...seriesRoutes(),
  ],
});

function seriesRoutes() {
  return [
    {
      path: '/series',
      name: 'series',
      component: SeriesView,
    },
    {
      path: '/series/add',
      name: 'add-series',
      component: AddSeriesView,
    },
    {
      path: '/series/edit/:id',
      name: 'edit-series',
      component: EditSeriesView,
    },
  ];
}

export default router;
