import 'dotenv/config';
import mongoose from 'mongoose';
import { Rooms } from './models/rooms.js';

const { MONGODB_HOST_URI } = process.env;
mongoose.set('strictQuery', false);
mongoose.connect(MONGODB_HOST_URI, () => console.log('Connected to DB'));
const cardsContent = [
	{
		_id: 1,
		id: 'general',
		image: { name: 'main', alt: 'Загальний чат' },
		roomName: 'Загальний чат',
		description: 'Чат для обговорення будь-яких тем, у народі називається “болталка”. Спілкуйся з різними людьми, щоб знайти однодумців!',
	},
	{
		_id: 2,
		id: 'dating',
		image: { name: 'dating', alt: 'Чат для знайомств' },
		roomName: 'Чат для знайомств',
		description: 'Знайомся з новими людьми, спілкуйся на спільні теми та знаходь своє справжнє кохання!',
	},
	{
		_id: 3,
		id: 'work',
		image: { name: 'work', alt: 'Робочий чат' },
		roomName: 'Робочий чат',
		description: 'Створюй анонімні чати для обговорення робочих питань, де важлива неупереджена анонімна думка!',
	},
	{
		_id: 4,
		name: 'news',
		id: { name: 'news', alt: 'Чат новин' },
		roomName: 'Чат новин',
		description: 'Обговорюй новини та політичну ситуацію у країні, аналізуй та ділись своїми думками з іншими!',
	},
	{
		_id: 5,
		id: 'business',
		image: { name: 'business', alt: 'Чат для бізнесу' },
		roomName: 'Чат для бізнесу',
		description: 'Кімната для обговорення тонкощів бізнес-процесів. Ділись своїми думками та знаннями з іншими! ',
	}
]

for(const room of cardsContent) {
  Rooms.create(room);
};
