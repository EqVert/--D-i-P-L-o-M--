import { useState } from 'react'
import {
	useAddCatMutation,
	useFetchCatsQuery,
	useDeleteCatMutation,
} from '../../store/cats/catApiSlice.js'
import { useDispatch } from 'react-redux'
import { catSelected } from '../../store/cats/catSlice.js'

export default function Cats() {
	const [name, setName] = useState('') //Создание состояния name
	const [colour, setColour] = useState('')

	const dispatch = useDispatch() //Инициализирует хук useDispatch для диспетчеризации действий в хранилище

	const { data } = useFetchCatsQuery() //Использует хук useFetchCatsQuery для выполнения запроса на получение списка котов и извлекает данные из ответа.
	const [addCat] = useAddCatMutation() //Использует хук useAddCatMutation для создания функции addCat, которая будет использоваться для отправки запроса на добавление нового кота.
	const [deleteCat] = useDeleteCatMutation()

	function submit(e) {
		//Действие при отправке формы
		e.preventDefault() //Сброс действия по умолчанию

		addCat({
			name,
			colour,
		})
	}

	const handleDelete = (catId) => {
		deleteCat(catId)
	}

	const cats = data?.map((cat) => (
		<div key={cat._id}>
			<div className=''>
				{cat.name} {cat.colour}
			</div>

			<button onClick={() => dispatch(catSelected(cat))}>Обрати кота</button>
			<button onClick={() => handleDelete(cat._id)}>Удалить кота</button>
		</div>
	))

	return (
		<>
			<form onSubmit={(e) => submit(e)}>
				<h2>Зробити нового кіта:</h2>
				<input
					onChange={(event) => setName(event.target.value)}
					value={name}
					type='text'
					placeholder='Імʼя'
					required
				/>
				<input
					onChange={(event) => setColour(event.target.value)}
					value={colour}
					type='text'
					placeholder='Колір'
					required
				/>
				<button type='submit'>Створити</button>
			</form>
			<div className='flex flex-row'>{cats}</div>
		</>
	)
}
