import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Provider, useSelector } from 'react-redux'
import { store } from './store/store.js'
import UsersList from './components/Users/UsersList'
import './styles/index.css'
import { authService } from './service/authService.js'

const App = lazy(() => import('./App.jsx'))
const Cats = lazy(() => import('./components/cats/Cats.jsx'))
const Tickets = lazy(() => import('./components/tickets/Tickets.jsx'))

// Компонент для защиты маршрута
const ProtectedRoute = ({ children }) => {
	const roles = authService.getUserInfo('realm_access')?.roles || []

	if (!roles.includes('ROLE_ADMIN_USER')) {
		return <div>Доступ запрещен. Необходима роль администратора.</div>
	}

	return children
}

// Обновляем маршрутизацию
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
				path: 'tickets',
				element: <Tickets />,
			},
			{
				path: 'users',
				element: (
					<ProtectedRoute>
						<UsersList />
					</ProtectedRoute>
				),
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
      с помощью созданного объекта маршрутизатора.
			ПУБЛИЧНА ЧАСТИНА */}
				<RouterProvider router={router} />
			</Suspense>
		</Provider>
	</React.StrictMode>
)
