import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Config para servir el Back desde el front mediante un proxy
  server:{
    proxy:{
      "/socket.io":{
          target: "http://localhost:3000/",
          ws:true
      }
    }
  }
})