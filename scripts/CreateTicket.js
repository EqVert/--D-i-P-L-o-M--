// Создаем тестовую заявку через MongoDB и Keycloak

import mongoose from 'mongoose'
import KcAdminClient from '@keycloak/keycloak-admin-client'

// Конфигурация подключения к Keycloak
const kcAdminClient = new KcAdminClient({
	baseUrl: 'http://localhost:8080',
	realmName: 'example',
})

// Аутентификация в Keycloak
await kcAdminClient.auth({
	clientId: 'backend',
	clientSecret: '6yMw2twx3jLWLuYZAtghoztfLTnIh0Fa',
	grantType: 'client_credentials',
})

// Подключение к MongoDB
await mongoose.connect('mongodb://localhost:27017')

// Создание схемы заявки с middleware для автогенерации номера
const ticketSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		description: { type: String, required: true },
		status: { type: String, required: true },
		priority: { type: String, required: true },
		deadline: { type: Date, required: true },
		plannedEffort: { type: Number, required: true },
		startDate: { type: Date, required: true },
		comment: { type: String, required: false },
		number: { type: Number, unique: true, required: true, default: 0 }, // Добавляем default: 0
		createdBy: { type: String, required: true },
		acceptedBy: { type: String, required: false },
	},
	{
		timestamps: true,
	}
)

// Добавляем pre-save middleware для автогенерации номера
ticketSchema.pre('save', async function (next) {
	if (this.isNew) {
		const lastTicket = await mongoose
			.model('tickets')
			.findOne()
			.sort({ number: -1 })
		this.number = lastTicket ? lastTicket.number + 1 : 1
	}
	next()
})

const Ticket = mongoose.model('tickets', ticketSchema)

// Категории и их проблемы
const categories = {
	hardware: {
		titles: [
			'Не працює принтер',
			'Проблеми з клавіатурою',
			'Не працює миша',
			'Не працює монітор',
			'Проблеми зі сканером',
			'Шумить кулер процесора',
			'Не працює USB порт',
			'Проблеми з веб-камерою',
			'Не працює графічний планшет',
			'Збої в роботі ІБЖ',
			'Артефакти на екрані',
			'Проблеми з аудіо системою',
			'Перегрів процесора',
			'Не працює друга відеокарта',
			'Проблеми з док-станцією',
		],
		descriptions: [
			'Принтер не друкує документи, видає помилку папера',
			'Деякі клавіші на клавіатурі не реагують на натискання',
			'Курсор миші рухається ривками або не рухається',
			'Монітор показує чорний екран при включенні',
			'Сканер не розпізнає документи при скануванні',
			'Система охолодження працює занадто голосно',
			'USB пристрої не визначаються системою',
			'Відсутнє зображення з веб-камери',
			'Графічний планшет не реагує на стилус',
			'ІБЖ не забезпечує живлення при відключенні',
			"На екрані з'являються кольорові смуги",
			'Відсутній звук або спотворення аудіо',
			'Температура процесора перевищує норму',
			'Друга відеокарта не визначається системою',
			'Док-станція не підключає периферійні пристрої',
		],
	},
	software: {
		titles: [
			'Не запускається Windows',
			'Помилка в Microsoft Office',
			'Проблеми з браузером',
			'Не працює 1С',
			'Помилка в Outlook',
			'Збій антивірусу',
			'Проблеми з драйверами',
			'Не працює корпоративний VPN',
		],
		descriptions: [
			'Система не завантажується після оновлення',
			'Excel видає помилку при відкритті файлів',
			'Chrome постійно зависає при відкритті вкладок',
			'База 1С видає помилку при запуску',
			'Outlook не відправляє пошту',
			'Антивірус не оновлює бази даних',
			'Відсутні драйвери після переустановки системи',
			'Неможливо підключитися до корпоративної мережі',
		],
	},
	network: {
		titles: [
			'Відсутній інтернет',
			'Повільна мережа',
			'Проблеми з Wi-Fi',
			'Не працює локальна мережа',
			'Обрив кабелю',
			'Конфлікт IP адрес',
			'Проблеми з DNS',
			'Не працює мережевий принтер',
			"Нестабільне VPN з'єднання",
			'Проблеми з маршрутизацією',
			'Високий пінг',
			'Втрата пакетів даних',
			'Проблеми з DHCP',
			'Конфлікт мережевих адаптерів',
			'Збій проксі-сервера',
		],
		descriptions: [
			'Повністю відсутній доступ до інтернету',
			'Дуже низька швидкість передачі даних',
			'Wi-Fi підключення постійно обривається',
			'Немає доступу до мережевих ресурсів',
			'Пошкоджений мережевий кабель біля робочого місця',
			'Виявлено дублювання IP адрес в мережі',
			'Проблеми з розрішенням доменних імен',
			'Мережевий принтер не виявляється в системі',
			"VPN з'єднання постійно розривається",
			'Пакети не досягають призначення',
			'Затримки в онлайн додатках',
			'Втрата більше 50% пакетів даних',
			'Не отримується IP адреса автоматично',
			'Конфлікт між дротовим та бездротовим підключенням',
			'Неможливо підключитися до проксі-сервера',
		],
	},
	security: {
		titles: [
			'Підозра на вірус',
			'Злом облікового запису',
			'Фішинговий лист',
			'Втрата доступу',
			'Витік даних',
			'Проблеми з паролем',
			'Підозріла активність',
			'Блокування облікового запису',
		],
		descriptions: [
			'Виявлено підозрілу активність на компʼютері',
			'Виявлено несанкціонований вхід в систему',
			'Отримано підозрілий лист з вкладенням',
			'Втрачено доступ до корпоративних ресурсів',
			'Виявлено несанкціонований доступ до даних',
			'Неможливо змінити пароль облікового запису',
			'Зафіксовано підозрілі процеси в системі',
			'Обліковий запис заблоковано системою безпеки',
		],
	},
	cad_3d: {
		titles: [
			'Не запускається AutoCAD',
			'Збій в Solidworks',
			'Проблеми з Fusion 360',
			'Помилка в Rhino 3D',
			'Зависання 3ds Max',
			'Проблеми з Blender',
			'Помилка в КОМПАС-3D',
			'Збій Maya',
			'Проблеми з SketchUp',
			'Помилка в ZBrush',
			'Не відкривається проект в Revit',
			'Збій в Cinema 4D',
			'Проблеми з V-Ray',
			'Помилка рендерингу Corona',
			'Збій при експорті в STEP',
		],
		descriptions: [
			'AutoCAD видає помилку при запуску проекту',
			'Solidworks зависає при роботі з великими збірками',
			'Fusion 360 не синхронізується з хмарою',
			'Rhino 3D не імпортує NURBS поверхні',
			'3ds Max вилітає при рендерингу',
			'Blender не зберігає налаштування матеріалів',
			'КОМПАС-3D не створює специфікації',
			'Maya не експортує анімацію',
			'SketchUp не відображає текстури',
			'ZBrush не розпізнає графічний планшет',
			'Revit не відкриває сімейства компонентів',
			'Cinema 4D видає помилку фізичного рендеру',
			'V-Ray не використовує GPU для рендерингу',
			'Corona видає помилку при налаштуванні матеріалів',
			'Помилка експорту моделі в формат STEP',
		],
	},
	// Остальные категории остаются без изменений
}

// Функция для случайного выбора элемента из массива
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Функция для генерации случа��ной даты в диапазоне
const getRandomDate = (start, end) => {
	return new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime())
	)
}

// Функция для случайного выбора категории
const getRandomCategory = () => {
	const categoryKeys = Object.keys(categories)
	return categoryKeys[Math.floor(Math.random() * categoryKeys.length)]
}

// Функция для генерации одной случайной заявки
async function createTicket(randomUser) {
	const category = getRandomCategory()
	const categoryData = categories[category]
	const index = Math.floor(Math.random() * categoryData.titles.length)

	const startDate = new Date()
	const endDate = new Date()
	endDate.setMonth(endDate.getMonth() + 3)

	const ticket = new Ticket({
		title: categoryData.titles[index],
		description: categoryData.descriptions[index],
		status: getRandomElement(['Відкрита', 'В роботі', 'Очікує відповіді']),
		priority: getRandomElement(['Високий', 'Середній', 'Низький']),
		deadline: getRandomDate(startDate, endDate),
		plannedEffort: Math.floor(Math.random() * 40) + 1,
		startDate: new Date(),
		comment: `Категорія: ${category}`,
		createdBy: randomUser.id,
		acceptedBy: '',
	})

	return ticket.save()
}

// Функция для получения следующего номера заявки
async function getNextTicketNumber() {
	const lastTicket = await Ticket.findOne().sort({ number: -1 })
	return lastTicket ? lastTicket.number + 1 : 1
}

// Функция генерации случайной даты в пределах 2024 года
function getRandomDate2024(isStart = true) {
	const start = new Date(2024, 0, 1) // 1 января 2024
	const end = new Date(2024, 11, 31) // 31 декабря 2024
	const randomDate = new Date(
		start.getTime() + Math.random() * (end.getTime() - start.getTime())
	)

	// Если это startDate, то дата должна быть не позже текущей
	if (isStart) {
		const now = new Date()
		return randomDate > now ? now : randomDate
	}
	return randomDate
}

// Модифицированная функция создания заявок
async function createMultipleTickets(count = 5) {
	try {
		const users = await kcAdminClient.users.find()
		if (users.length === 0) {
			console.error('Не знайдено користувачів')
			process.exit(1)
		}

		console.log(`Починаємо створення ${count} заявок...`)

		const createdTickets = []
		for (let i = 0; i < count; i++) {
			try {
				const nextNumber = await getNextTicketNumber()
				const randomUser = users[Math.floor(Math.random() * users.length)]
				const category = getRandomCategory()
				const categoryData = categories[category]
				const index = Math.floor(Math.random() * categoryData.titles.length)

				// Генерация случайных дат
				const startDate = getRandomDate2024(true)
				const deadline = new Date(
					Math.max(startDate.getTime(), getRandomDate2024(false).getTime())
				)

				const ticket = new Ticket({
					title: categoryData.titles[index],
					description: categoryData.descriptions[index],
					status: getRandomElement([
						'Відкрита',
						'В роботі',
						'Очікує відповіді',
					]),
					priority: getRandomElement(['Високий', 'Середній', 'Низький']),
					deadline: deadline,
					plannedEffort: Math.floor(Math.random() * 40) + 1,
					startDate: startDate,
					comment: `Категорія: ${category}`,
					createdBy: randomUser.id,
					acceptedBy: '',
					number: nextNumber,
				})

				const savedTicket = await ticket.save()
				createdTickets.push(savedTicket)
				console.log(
					`Створено заявку #${
						savedTicket.number
					} від ${startDate.toLocaleDateString('uk-UA')}`
				)
			} catch (error) {
				console.error(`Помилка при створенні заявки ${i + 1}:`, error.message)
			}
		}

		console.log(
			`\nУспішно створено ${createdTickets.length} заявок з ${count}:`
		)
		createdTickets.forEach((ticket) => {
			console.log(`Заявка №${ticket.number}: ${ticket.title}`)
			console.log(
				`   Створено: ${ticket.startDate.toLocaleDateString('uk-UA')}`
			)
			console.log(`   Дедлайн: ${ticket.deadline.toLocaleDateString('uk-UA')}`)
		})
	} catch (error) {
		console.error('Помилка при створенні заявок:', error)
	} finally {
		await mongoose.disconnect()
	}
}

// Запуск создания заявок
await createMultipleTickets(10)
