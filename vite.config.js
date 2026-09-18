import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // O graficos (recharts), as animacoes (motion) e o fundo WebGL (ogl) nao
    // caberiam no mesmo chunk do app. Cada pagina ja carrega sob demanda
    // (React.lazy em App.jsx); aqui separamos as libs compartilhadas para que
    // uma mudanca no codigo da aplicacao nao invalide o cache delas.
    // O Vite 8 roda sobre Rolldown, que aceita manualChunks apenas na forma
    // de funcao (o objeto literal de versoes antigas quebra o build).
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("recharts") || id.includes("d3-")) return "charts";
          if (id.includes("motion")) return "motion";
          if (id.includes("ogl")) return "webgl";
          return undefined;
        },
      },
    },
  },
})
