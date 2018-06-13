-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Июн 13 2018 г., 15:28
-- Версия сервера: 5.6.38
-- Версия PHP: 5.5.38

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `findToys`
--

-- --------------------------------------------------------

--
-- Структура таблицы `events`
--

CREATE TABLE `events` (
  `id_event` int(11) NOT NULL,
  `state` tinyint(1) NOT NULL DEFAULT '0',
  `area` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `size` int(4) NOT NULL,
  `text` text COLLATE utf8_unicode_ci NOT NULL,
  `code` int(4) NOT NULL,
  `url_img` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_win` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Дамп данных таблицы `events`
--

INSERT INTO `events` (`id_event`, `state`, `area`, `size`, `text`, `code`, `url_img`, `user_win`) VALUES
(1, 0, 'Бараба', 40, 'INSERT – запрос, который позволяет ПЕРВОНАЧАЛЬНО вставить запись в БД. То есть создаёт НОВУЮ запись (строчку) в БД.', 1234, 'build/assets/styles/img/y22fzHfjkSE.jpg', 'Константин'),
(2, 1, 'Вокзал', 40, 'Ребята не знал кода обратился с данной проблемой, не могу удалить таблицу. Вроде бы делаю все правильно, но почему-то желаемого результата нету. 1) Создал таблицу 2) Вывел все таблици ', 4324, '', 'Саша'),
(3, 0, 'Горняк', 20, 'Допустим у Вас в таблице пользовательских данных есть страна. Так вот если Вы хотите вывести ТОЛЬКО список встречающихся значений (чтобы, например, Россия не выводилось 20 раз, а только один)', 5425, 'build/assets/styles/img/y22fzHfjkSE.jpg', 'Killer'),
(4, 0, 'Криулино', 20, 'Величины в столбцах VARCHAR представляют собой строки переменной длины. Так же как и для столбцов CHAR, можно задать столбец VARCHAR любой длины между 1 и 255.', 5633, '', 'Константин');

-- --------------------------------------------------------

--
-- Структура таблицы `faq`
--

CREATE TABLE `faq` (
  `id` int(11) NOT NULL,
  `questions` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `answers` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Дамп данных таблицы `faq`
--

INSERT INTO `faq` (`id`, `questions`, `answers`) VALUES
(1, '#Что мне нужно делать??', 'Нужно разгадать место которое описано в подсказке текущего ивента, отправится туда и найти в округе игрушку, она и будет тебе приятным сюрпризом.Также вместе с игрушкой ты добудешь \"код победителя\". Вводишь код на сайте и тем самым открывается новый ивент.'),
(2, '#Почему такие простые загадки??', 'Сложность искомых мест будет постепенно повышаться в зависимости от интереса и кол-ва людей. Также это относится и к игрушкам которые ты будешь получать.'),
(3, '#Что за рейтинг игроков??', 'Вместе с игрушкой которую ты найдёшь, у тебя будет \"код победителя\", после того как ты введёшь код и своё имя(или никнейм) ты попадаешь в таблицу рейтинга и у тебя 1 очко(разгаданное место). Последующие разы вводи код под тем же именем, тем самым увеличивая очки. В таблице отображены только ТОП 3 игрока.');

-- --------------------------------------------------------

--
-- Структура таблицы `Persons`
--

CREATE TABLE `Persons` (
  `ID` int(11) NOT NULL,
  `Name` text CHARACTER SET utf8 NOT NULL,
  `count_wins` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Дамп данных таблицы `Persons`
--

INSERT INTO `Persons` (`ID`, `Name`, `count_wins`) VALUES
(34, 'Killer', 2),
(35, 'Саша', 1),
(36, 'Константин', 2);

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id_event`);

--
-- Индексы таблицы `faq`
--
ALTER TABLE `faq`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `Persons`
--
ALTER TABLE `Persons`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `Persons`
--
ALTER TABLE `Persons`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
