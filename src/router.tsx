import { createBrowserRouter } from 'react-router'
import { SiteLayout } from '@/components/layout/site-layout'
import { BlogPage } from '@/pages/blog'
import { ContactPage } from '@/pages/contact'
import { ExperiencePage } from '@/pages/experience'
import { HomePage } from '@/pages/home'
import { NotFoundPage } from '@/pages/not-found'

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'experience', element: <ExperiencePage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
