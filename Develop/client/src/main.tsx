import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.jsx'
import SearchGames from './pages/SearchGames.js'
import SavedGames from './pages/SavedGames.js'
import Leaderboard from './components/Leaderboard.js'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <h1 className='display-2'>Wrong page!</h1>,
    children: [
      {
        index: true,
        element: <SearchGames />
      }, {
        path: '/saved',
        element: <SavedGames />
      },
      {
        path: '/leaderboard',
        element: <Leaderboard />
      },
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />
)
