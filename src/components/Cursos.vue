<template>
    <div class="container mt-4">
      <h1 class="text-center mb-4">Gestión de Cursos</h1>
  
      <!-- Formulario para Crear y Editar Curso -->
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">{{ editando ? "Editar Curso" : "Agregar Curso" }}</h5>
          <form @submit.prevent="editando ? actualizarCurso() : agregarCurso()">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre del Curso</label>
              <input
                v-model="cursoActual.nombre"
                id="nombre"
                class="form-control"
                placeholder="Ingrese el nombre del curso"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary">
              {{ editando ? "Actualizar" : "Agregar" }}
            </button>
            <button
              v-if="editando"
              type="button"
              class="btn btn-secondary ms-2"
              @click="cancelarEdicion"
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
  
      <!-- Tabla de Cursos -->
      <table class="table table-striped">
        <thead class="table-dark">
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(curso, index) in cursos" :key="curso.id">
            <td>{{ index + 1 }}</td>
            <td>{{ curso.nombre }}</td>
            <td>
              <button
                class="btn btn-warning btn-sm me-2"
                @click="cargarCursoParaEditar(curso)"
              >
                Editar
              </button>
              <button
                class="btn btn-danger btn-sm"
                @click="eliminarCurso(curso.id)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        cursos: [],
        cursoActual: { id: null, nombre: "" },
        editando: false,
      };
    },
    methods: {
      async cargarCursos() {
        const res = await axios.get("http://localhost:3000/cursos");
        this.cursos = res.data;
      },
      async agregarCurso() {
        await axios.post("http://localhost:3000/cursos", this.cursoActual);
        this.cursoActual.nombre = "";
        this.cargarCursos();
      },
      async cargarCursoParaEditar(curso) {
        this.cursoActual = { ...curso };
        this.editando = true;
      },
      async actualizarCurso() {
        await axios.put(
          `http://localhost:3000/cursos/${this.cursoActual.id}`,
          this.cursoActual
        );
        this.cancelarEdicion();
        this.cargarCursos();
      },
      async eliminarCurso(id) {
        await axios.delete(`http://localhost:3000/cursos/${id}`);
        this.cargarCursos();
      },
      cancelarEdicion() {
        this.cursoActual = { id: null, nombre: "" };
        this.editando = false;
      },
    },
    mounted() {
      this.cargarCursos();
    },
  };
  </script>
  