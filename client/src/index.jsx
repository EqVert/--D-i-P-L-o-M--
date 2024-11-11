import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Provider } from 'react-redux'
import { store } from './store/store.js'

import './styles/index.css'

const App = lazy(() => import('./App.jsx'))
const Cats = lazy(() => import('./components/cats/Cats.jsx'))
const Tickets = lazy(() => import('./components/tickets/Tickets.jsx'))

// Определяем маршрут для приложений, корневые и дочерние элементы в адресной строке
const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: 'cats',
				element: <Cats />,
			},
			{
				path: 'tikets',
				element: <Tickets />,
			},
		],
	},
])

//Создаём корневой DOM-узел для React приложения, используя элемент с идентификатором root.
const root = createRoot(document.getElementById('root'))

// Рендер (отображение) приложение в корневой DOM-узел
root.render(
	<React.StrictMode>
		{/* Provider делает Redux store доступным для всех подключенных компонентов в приложении. */}
		<Provider store={store}>
			{/* Suspense оборачивает RouterProvider, позволяя отображать запасной контент
    (<div>Loading...</div>) во время загрузки ленивых компонентов. */}
			<Suspense fallback={<div>Loading...</div>}>
				{/* RouterProvider используется для включения маршрутизации в приложении
      с помощью созданного объекта маршрутизатора. */}
				<RouterProvider router={router} />
			</Suspense>
		</Provider>
	</React.StrictMode>
)
