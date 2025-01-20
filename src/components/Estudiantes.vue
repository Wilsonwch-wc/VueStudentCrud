<template>
    <div class="container mt-4">
      <h1 class="text-center mb-4">Gestión de Estudiantes</h1>
  
      <!-- Formulario para Crear y Editar Estudiantes -->
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">{{ editando ? "Editar Estudiante" : "Agregar Estudiante" }}</h5>
          <form @submit.prevent="editando ? actualizarEstudiante() : agregarEstudiante()">
            <div class="mb-3">
              <label for="nombre" class="form-label">Nombre del Estudiante</label>
              <input
                v-model="estudianteActual.nombre"
                id="nombre"
                class="form-control"
                placeholder="Ingrese el nombre del estudiante"
                required
              />
            </div>
            <div class="mb-3">
              <label for="curso" class="form-label">Curso</label>
              <select
                v-model="estudianteActual.cursoId"
                id="curso"
                class="form-select"
                required
              >
                <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
                  {{ curso.nombre }}
                </option>
              </select>
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
  
      <!-- Buscador y Filtro -->
      <div class="d-flex justify-content-between mb-3">
        <div>
          <input
            v-model="busqueda"
            type="text"
            class="form-control"
            placeholder="Buscar por nombre"
          />
        </div>
        <div>
          <select v-model="filtroCursoId" class="form-select">
            <option value="">Todos los cursos</option>
            <option v-for="curso in cursos" :key="curso.id" :value="curso.id">
              {{ curso.nombre }}
            </option>
          </select>
        </div>
      </div>
  
      <!-- Tabla de Estudiantes -->
      <table class="table table-striped">
        <thead class="table-dark">
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Curso</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(estudiante, index) in estudiantesFiltrados"
            :key="estudiante.id"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ estudiante.nombre }}</td>
            <td>{{ obtenerNombreCurso(estudiante.cursoId) }}</td>
            <td>
              <button
                class="btn btn-warning btn-sm me-2"
                @click="cargarEstudianteParaEditar(estudiante)"
              >
                Editar
              </button>
              <button
                class="btn btn-danger btn-sm"
                @click="eliminarEstudiante(estudiante.id)"
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
        estudiantes: [],
        cursos: [],
        estudianteActual: { id: null, nombre: "", cursoId: null },
        editando: false,
        busqueda: "",
        filtroCursoId: "",
      };
    },
    computed: {
      estudiantesFiltrados() {
        return this.estudiantes.filter((estudiante) => {
          const coincideNombre = estudiante.nombre
            .toLowerCase()
            .includes(this.busqueda.toLowerCase());
          const coincideCurso =
            !this.filtroCursoId || estudiante.cursoId === this.filtroCursoId;
          return coincideNombre && coincideCurso;
        });
      },
    },
    methods: {
      async cargarEstudiantes() {
        const res = await axios.get("http://localhost:3000/estudiantes");
        this.estudiantes = res.data;
      },
      async cargarCursos() {
        const res = await axios.get("http://localhost:3000/cursos");
        this.cursos = res.data;
      },
      async agregarEstudiante() {
        await axios.post("http://localhost:3000/estudiantes", this.estudianteActual);
        this.limpiarFormulario();
        this.cargarEstudiantes();
      },
      async cargarEstudianteParaEditar(estudiante) {
        this.estudianteActual = { ...estudiante };
        this.editando = true;
      },
      async actualizarEstudiante() {
        await axios.put(
          `http://localhost:3000/estudiantes/${this.estudianteActual.id}`,
          this.estudianteActual
        );
        this.cancelarEdicion();
        this.cargarEstudiantes();
      },
      async eliminarEstudiante(id) {
        await axios.delete(`http://localhost:3000/estudiantes/${id}`);
        this.cargarEstudiantes();
      },
      cancelarEdicion() {
        this.limpiarFormulario();
      },
      limpiarFormulario() {
        this.estudianteActual = { id: null, nombre: "", cursoId: null };
        this.editando = false;
      },
      obtenerNombreCurso(cursoId) {
        const curso = this.cursos.find((curso) => curso.id === cursoId);
        return curso ? curso.nombre : "Sin curso";
      },
    },
    mounted() {
      this.cargarEstudiantes();
      this.cargarCursos();
    },
  };
  </script>
  