# oneNotification JavaScript Library

## Описание

`oneNotification` — это JavaScript библиотека для создания и управления уведомлениями на вашей веб-странице.

## Установка

```html
<script src="path/to/oneNotificationJS.js"></script>
```

## Инициализация

При инициализации экземпляра класса `oneNotification` вы можете задать следующие опции, которые будут применяться ко всем уведомлениям в этом блоке:

```javascript
const myNotification = new oneNotification("myNotificationName", {
    position: 'bottom-center',
    alertsLimit: 5,
    equeLimit: 1000,
    removeLastAlert: false,
    width: '200px'
});
```

### Опции для инициализации

- `position`: Позиция уведомлений на странице. По умолчанию 'bottom-center'. Допустимые значения: 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'.
- `alertsLimit`: Максимальное количество активных уведомлений на странице. По умолчанию 5.
- `equeLimit`: Максимальное количество уведомлений в очереди. По умолчанию 1000.
- `removeLastAlert`: Удалять ли последнее уведомление при достижении `alertsLimit`. По умолчанию `false`.
- `width`: Ширина уведомлений. По умолчанию '200px'.

## Опции для каждого уведомления

При создании каждого уведомления вы можете задать следующие опции:

- `closeOnTime`: Время в миллисекундах, через которое уведомление закроется.
- `HTML`: Вставка своего HTML-кода через массив.
- `preConfirm`: Функция для выполнения проверки после нажатия кнопки "Подтвердить".
- `confirmBTN`, `cancelBTN`, `closeBTN`: Показать или скрыть соответствующие кнопки.
- `fixed`: Зафиксировать уведомление на странице.
- `confirmBTNText`, `cancelBTNText`: Текст для кнопок "Подтвердить" и "Отмена".
- `confirmBTNFocus`, `cancelBTNFocus`: Установить фокус на соответствующую кнопку.
- `type`, `title`, `text`: Тип, заголовок и текст уведомления.

## Методы

### `showNotification(params)`

Отображает уведомление на странице с учетом переданных параметров.

#### Пример использования HTML и валидации:

... *(как в предыдущем примере)* ...

---

### `showValidationMessage(text, obj)`

Этот метод позволяет показать сообщение валидации в определенном блоке уведомления.

- `text`: Текст сообщения валидации.
- `obj`: Блок уведомления, в который будет добавлено сообщение. По умолчанию, это событие (`event`) из функции.

#### Пример:

\`\`\`javascript
preConfirm: (e) => {
    const password = $('.password-input').val();

    if (password === '') {
        notificationMain.showValidationMessage('Fill in the password field!', e);
        return false;
    }
    ...
}
\`\`\`
