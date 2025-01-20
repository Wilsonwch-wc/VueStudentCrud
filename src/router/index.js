import { createRouter, createWebHistory } from 'vue-router';
import Estudiantes from '../components/Estudiantes.vue';
import Cursos from '../components/Cursos.vue';

const routes = [

   {
     path: '/estudiantes', 
     component: Estudiantes 
    },
  { path: '/cursos', component: Cursos },

  
  { path: '/', redirect: '/estudiantes' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
