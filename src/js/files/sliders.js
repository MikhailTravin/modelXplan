/*
Документация по работе в шаблоне: 
Документация слайдера: https://swiperjs.com/
Сниппет(HTML): swiper
*/

// Подключаем слайдер Swiper из node_modules
// При необходимости подключаем дополнительные модули слайдера, указывая их в {} через запятую
// Пример: { Navigation, Autoplay }
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper';
/*
Основные модули слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Подробнее смотри https://swiperjs.com/
*/

// Стили Swiper
// Базовые стили
import "../../scss/base/swiper.scss";
// Полный набор стилей из scss/libs/swiper.scss
// import "../../scss/libs/swiper.scss";
// Полный набор стилей из node_modules
// import 'swiper/css';

// Список слайдеров
if (document.querySelector('.portfolio__slider')) { // Указываем склад нужного слайдера
	// Создаем слайдер
	new Swiper('.portfolio__slider', { // Указываем склад нужного слайдера
		// Подключаем модули слайдера
		// для конкретного случая
		modules: [Navigation, Pagination],
		observer: true,
		observeParents: true,
		slidesPerView: 1,
		spaceBetween: 20,
		speed: 800,

		// Пагинация
		pagination: {
			el: '.portfolio__pagination',
			type: "fraction",
		},

		// Кнопки «влево/вправо»
		navigation: {
			prevEl: '.portfolio__arrow-prev',
			nextEl: '.portfolio__arrow-next',
		},
	});
}
