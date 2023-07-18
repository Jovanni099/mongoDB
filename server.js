const express = require('express');
const { connectToDb, getDb } = require('./db');

const PORT = 3000;

const app = express();

let db;

connectToDb((err) => {
    if (!err) {
        app.listen(PORT, (err) => {
            err ? console.log(err) : console.log(`Listen port ${PORT}`);
        });
        db = getDb();
    } else {
        console.log(`DB connection error: ${err}`);
    }
})

// Нужно создать роут, по которому мы будем запрашивать данные из MongoDB
/* 1. Обращаемся к созданному экспресс приложению, вызываем у него метод get, который принимает два аргумента, первый - это путь по которому
запрашиваются данные. Второй аргумент, это колбэк, который принимает объекты запроса и ответа. Внутри данного роута, который в теле 
колбэка мы можем обратиться к нашей базе. При успешном подключении, она хранится в переменной db */
app.get('/movies', (req, res) => {
    /* 4. Настало время обработать данные и вернуть их. Для этого создаем пустой массив movies. Далее после метода find добавляем метод forEach, внутри 
    которого мы перебираем полученный объект курсор с помощью переданного колбэка, создаем колбэк, туда передаем параметр, который будет каждым итерируемым 
    элементом курсора. Из этого объекта мы получаем документ и далее этот документ добавляем в созданный массив movies. */
    const movies = [];
    /* 2. Внутри данного роута, который в теле колбэка мы можем обратиться к нашей базе. При успешном подключении, она хранится в переменной db */
    db
        .collection('movies') // 3. Внутрь метода передаем имя коллекции, которая есть в базе данных.
        .find() /* 4. таким образом мы хотим получить все документы, хранящиеся в нашей коллекции. На самом деле find не возвращает документы, он возвращает указатель
    на возвращенную коллекцию документов, которая называется курсором. Курсоры инкапсулируют в себе наборы, получаемые из БД объектов. По умолчанию курсор
    будет повторяться автоматически при возврате результата запроса, но можно также явно просматривать элементы, возвращаемые в курсоре один за другим. Таким 
    образом, основной ньанс мы не получаем коллекцию, а получаем специальный объект курсор. Курсор обладает набором методов. Например hasNext, который 
    показывает при переборе имеется ли еще в наборе документ. Метод next извлекает текущий документ и перемещает курсор к следующему документу в наборе.
    Также для перебора документов в курсоре в качестве альтернативы можно использовать конструкцию итератора JS forEach, важная особенность заключается также 
    в том, что монгоДБ при find-запросе не возвращает все данные.  */
        /* 6. Кстати нашу цепочку методов мы можем расширить и после find() указать например метод sort() внутрь которого передать объект с ключом title и 
        значением 1, т.о. возвращаемые фильмы мы отсортируем по заголовку в алфавитном порядке. Нажимаем SEND и теперь фильмы возвращаются по алфавиту. Кстати
        протестировать наш работающий API мы можем не только в Postman, но и в браузере: копируем путь запроса и вставляем в адресную строку хром. Результатом 
        получаем тот же JSON со списком фильмов.  */
        .sort({ title: 1 })
        .forEach((movie) => {
            movies.push(movie)
        })
        /* 5. И поскольку данные методы являются асинхронными, то в конце мы добавляем блок then, внутри которого модифицируем возвращаем возвращаемый ответ,
        для начала - для успешного ответа устанавливаем статус 200, а затем с помощью метода json возвращаем созданный массив movies. Теперь созданную логику
        нам нужно протестировать в постмане/инсомнии. Создаем гет-запрос, затем в поле запроса вводим http://localhost:3000/movies, /movies - это роут, по 
        которому мы запрашиваем все фильмы. И нажимаем SEND, и если все верно, мы должны получить полный список фильмов, которые хранятся в бд по указанной 
        коллекции. Мы создали первый эндпоинт для нашего API */
        .then(() => {
            res
                .status(200)
                .json(movies)
        })
        /* 6. Давайте расширим его негативным кейсом, это будет блок catch, то есть если вдруг запрос к БД упадет и мы ничего не получим, то в ответе вернутся
        статус 500 и в методе json передадим объект с строкой ошибки.  */
        .catch(() => {
            res
                .status(500)
                .json({ error: "Something goes wrong..." })
        })
})


