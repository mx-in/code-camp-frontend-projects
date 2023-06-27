import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Drum from './drum'
import Root from './routers/root'

import ErrorPage from './error-page'
import MarkdownPreview from './markdown-preview'
import AppWrapper from './quote'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />
  },
  {
    path: 'drum',
    element: <Drum />
  },
  {
    path: 'markdown',
    element: <MarkdownPreview />
  },
  {
    path: 'quote',
    element: <AppWrapper />
  }
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
