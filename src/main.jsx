import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './Router/Router.jsx'
import AuthProvider from './Providers/AuthProvider.jsx'
import { ThemeProvider } from './Providers/ThemeContext.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClint = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>



    <QueryClientProvider client={queryClint}>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router}></RouterProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>



  </StrictMode>,
)
