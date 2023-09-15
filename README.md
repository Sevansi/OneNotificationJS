# oneNotification JavaScript Library

## Описание

`oneNotification` — это JavaScript библиотека для создания и управления уведомлениями на вашей веб-странице.

## Установка

Для работы используется библиотека `Jqeury` и файл `css` стилей.

```html
<script src="<?php echo PATH_JS .'jquery-3.6.0.js';?>"></script>
```

```html
<script src="path/to/oneNotificationJS.js"></script>
```

```html
<link href="onenotification.css" rel="stylesheet" type="text/css">
```

##### Иконки
При создание была использована библиотека иконок google font.

~ Иконки могут быть заменены на любые свои.
```html
<link href='https://fonts.googleapis.com/icon?family=Material+Icons+Outlined' rel="stylesheet" type="text/css">
```

##### Порядок установки
- С начало подключити библиотеку `jqeury`.
- Остальные файлы могут быть подключены в любом порядку.

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
    confirmBTN: true,
    cancelBTN: true,
    closeOnTime: 320000,
    closeBTN: false,
    fixed: true,
});
```

При использование функции preConfirm вы также можете передать внутрь класса массив любых значений, в таком случае функция preConfirm будет считать пройденой успешно! Если вам нужно отменить выполнения просто передайте `false`

```Javascript
preConfirm: (event) => {
    notificationMain.showValidationMessage('message', event);
},
```

Или если хотите можете выводить валидацию в другой блок, можете его найти по ID добавляным через `html`.

## Примеры:

