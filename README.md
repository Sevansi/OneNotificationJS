# oneNotification JavaScript Library

## Описание

`oneNotification` — это JavaScript библиотека для создания и управления уведомлениями на вашей веб-странице.

## Установка

Для работы используется библиотека `Jquery` и файл `css` стилей.

Jquery
```html
<script src="<?php echo PATH_JS .'jquery-3.6.0.js';?>"></script>
```

oneNotifacation js
```html
<script src="path/to/oneNotificationJS.js"></script>
```

oneNotification css
```html
<link href="onenotification.css" rel="stylesheet" type="text/css">
```

icons
```html
<link href='https://fonts.googleapis.com/icon?family=Material+Icons+Round' rel="stylesheet" type="text/css">
```

#### Порядок установки
- С начало подключите библиотеку `jquery`.
- Остальные файлы могут быть подключены в любом порядку.

#### Иконки
При создание была использована библиотека иконок google font.

~ Иконки могут быть заменены на любые свои.

Чтобы установить всои иконки при иницализации укажите icons: {} где будут переданы парметры для `success`, `warning`, `error` иконок соотвествено.

Пример установки своей иконки font awesome для события `success`, `warning`.

```Javascript
const notificationMain = new oneNotification('main-alert', {
    ...
	icons: {
        'success': $('<i>').addClass('fa-solid fa-check'),
        'warrning': $('<i>').addClass('fa-solid fa-triangle-exclamation'),
        ...
    },
    ...
});
```

## Инициализация

При инициализации экземпляра класса `oneNotification` вы можете задать следующие опции, которые будут применяться ко всем уведомлениям в этом блоке:

```javascript
const myNotification = new oneNotification("myNotificationName", {
    position: 'bottom-center',
    alertsLimit: 5,
    equeLimit: 1000,
    removeLastAlert: false,
    width: '200px',
    
});
```

### Опции для инициализации

- `position`: Позиция уведомлений на странице. По умолчанию `bottom-center`. Допустимые значения: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`, `center-center`.
- `alertsLimit`: Максимальное количество активных уведомлений на странице. По умолчанию `5`.
- `equeLimit`: Максимальное количество уведомлений в очереди. По умолчанию `1000`.
- `removeLastAlert`: Удалять ли последнее уведомление при достижении `alertsLimit`. По умолчанию `false`, если включенно, будет удалять последнее уведомление, кроме тех у кого есть fixed.
- `width`: Ширина уведомлений. По умолчанию `200px`.
- `theme`: Установка темы. По умолчанию `light`.
- `icons`: Установка своих иконок. По умолчанию используется с `google fonts`.
- `debug`: Включить режим отладки, будут видны сообщения о загрузке, уаделение и т.д. В консоли.
- С помощью добавления кастомного имени при иницализации вы можете добвлять свои стили, свойства, события для каждого отдельного блока const myNotification = new oneNotification(`myNotificationName`, {params})

### Опции для каждого уведомления

При создании каждого уведомления вы можете задать следующие опции:

- `closeOnTime`: Время в миллисекундах, через которое уведомление закроется.
- `HTML`: Вставка своего HTML-кода через массив.
- `preConfirm`: Функция для выполнения проверки после нажатия кнопки "Подтвердить".
- `willOpen`: Функция которая сработает при открытие уведомления.
- `confirmBTN`, `cancelBTN`, `closeBTN`: Показать или скрыть соответствующие кнопки.
- `fixed`: Зафиксировать уведомление на странице(не будет пропадать при достижение alertsLimit, всегда будет видно).
- `confirmBTNText`, `cancelBTNText`: Текст для кнопок "Подтвердить" и "Отмена".
- `confirmBTNFocus`, `cancelBTNFocus`: Установить фокус на соответствующую кнопку (устанавливается принудительно, если есть несколько фокусов можетет быть конфликт).
- `type`, `title`, `text`: Тип, заголовок и текст уведомления (title вы можете установить свой, или оставить пустое поле, тогда будет взят стандартный подходящий к ситации `error` -> 'error', `warning` -> 'warning', `success` -> 'success').
- `customClass`: Установка своего класса, если хотите добавить свои стили, можно дабавить несколько классов

### Методы

#### `showNotification(params)`

Отображает уведомление на странице с учетом переданных параметров.

```Javascript
notificationMain.showNotification({
    type: 'warning',
    title: 'Add a new user?',
    confirmBTN: true,
    cancelBTN: true,
})
```

#### `showValidationMessage(text, obj)`

Этот метод позволяет показать сообщение валидации в определенном блоке уведомления.

- `text`: Текст сообщения валидации.
- `obj`: Блок уведомления, в который будет добавлено сообщение. По умолчанию, это событие (`event`) из функции.

Для правильного использования, передайте первым аргументом текст, а второым event полученый из функции

#### Пример использования HTML и валидации:

```Javascript
notificationMain.showNotification({
    type: 'warning',
    title: 'Change password?',
    text: 'The password will be changed for all selected users except you!',
    html: [
        $('<input>').addClass('password-input').attr({
            'placeholder': 'Password',
            'type': 'text',
            'autocomplete': 'off',
            'name': 'password',
            'title': 'The password must contain at least 8 characters'
        }).prop('required', true),
    ],
    preConfirm: (e) => {
        const password = $('.password-input').val();

        if (password === '') {
            notificationMain.showValidationMessage('Fill in the password field!', e);
            return false;
        }
        else if (password.length < 8) {
            notificationMain.showValidationMessage('Password must be at least 8 characters long!', e);
            return false;
        }
        return true;
    },
});
```

При использование функции preConfirm вы также можете передать внутрь класса массив любых значений, в таком случае функция preConfirm будет считать пройденой успешно! Если вам нужно отменить выполнения просто передайте `false`

```Javascript
preConfirm: (event) => {
    notificationMain.showValidationMessage('message', event);
},
```

Или если хотите можете выводить валидацию в другой блок, можете его найти по ID добавляным через `html`.

#### Используйте .then()

Вы можете использовать ключевое слово then() для выполнения действия после закрытия уведомления.
Получите параметры закрытия через любую перменую используемую в функции

```Javascript
.then(result => {
    console.log(result);
});
```

В result вы получите параметры

- `isClose`: При закрытие на кнопку закрытия.
- `isConfirm`: При нажатие на кнопку подтвердить.
- `isCancel`: При нажатие на кнопку отмены.
- `isTimeout`: При истичение времени.
- `isLastClose`: При закрытие, если он был закрыт при использование параметра `removeLastAlert` = true.

Так-же если вы использали функцию `preConfirm` и вернули несколько значений, то при закрытие через `isConfirm` вы получите все свои переданые параметры.

## Примеры:
### Базовый вариант иницализации

```Javascript
const notificationMain = new oneNotification('main-alert', {
	position: 'bottom-center',
	alertsLimit: 3,
	width: '320px',
	removeLastAlert: true,
});
```

### Базовый вариант вызова

```Javascript
notificationMain.showNotification({
    type: 'warning',
    text: 'Add a new user?',
    confirmBTN: true,
    cancelBTN: true,
    closeOnTime: 12000,
    closeBTN: false,
    fixed: true,
    confirmBTNFocus: true,
})
```

### Сложный пример, использования всех функций.

```Javascript
notificationMain.showNotification({
    type: 'warning',
    title: 'Change password?',
    text: 'The password will be changed for all selected users except you!',
    html: [
        $('<input>').addClass('password-input').attr({
            'placeholder': 'Password',
            'type': 'text',
            'autocomplete': 'off',
            'name': 'password',
            'title': 'The password must contain at least 8 characters'
        }).prop('required', true),
    ],
    preConfirm: (e) => {
        const password = $('.password-input').val();

        if (password == '') {
            notificationMain.showValidationMessage('Fill in the password field!', e);
            return false;
        }
        else if (password.length < 8) {
            notificationMain.showValidationMessage('Password must be at least 8 characters long!', e);
            return false;
        }
        else return password;
    },
    confirmBTN: true,
    cancelBTN: true,
    closeOnTime: 32000,
    closeBTN: false,
    fixed: true,
}).then(result => {
    if (result.isConfirm) {
        $.ajax({
            // Выполнения ajax запроса, или другая ваша проверка.
            type: 'POST',
            url: '...',
            data: { 'idRow': idRow, 'password': result.value },
            dataType: 'json',
            success: function (response) {
                response.forEach(response => {
                    notificationMain.showNotification({
                        type: response.status, // Вывод статуса ошибки или успешно
                        text: response.message, // Сообщение
                        closeOnTime: 5000,
                    });
                });
            },
        });
    }
});
```































