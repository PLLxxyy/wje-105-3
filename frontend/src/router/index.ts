import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import Home from '../pages/Home.vue';
import RecipeList from '../pages/RecipeList.vue';
import RecipeDetailPage from '../pages/RecipeDetail.vue';
import RecipeCreate from '../pages/RecipeCreate.vue';
import RecipeEdit from '../pages/RecipeEdit.vue';
import IngredientLibrary from '../pages/IngredientLibrary.vue';
import Collections from '../pages/Collections.vue';
import AnimationDemo from '../pages/AnimationDemo.vue';
import RecipeComparePage from '../pages/RecipeCompare.vue';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: Home },
  { path: '/recipes', name: 'recipes', component: RecipeList },
  { path: '/recipes/new', name: 'recipe-create', component: RecipeCreate },
  { path: '/recipes/:id', name: 'recipe-detail', component: RecipeDetailPage },
  { path: '/recipes/:id/edit', name: 'recipe-edit', component: RecipeEdit },
  { path: '/ingredients', name: 'ingredients', component: IngredientLibrary },
  { path: '/collections', name: 'collections', component: Collections },
  { path: '/animation', name: 'animation', component: AnimationDemo },
  { path: '/compare', name: 'compare', component: RecipeComparePage },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});
