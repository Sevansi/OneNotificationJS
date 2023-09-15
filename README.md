# oneNotification JavaScript Library

## Description

`oneNotification` — This is a JavaScript library for creating and managing notifications on your web page.

## Installation

For operation, the `Jquery` library and a `css` stylesheet file are used.

Jquery
```html
<script src="<?php echo PATH_JS .'jquery-3.6.0.js';?>"></script>
```

oneNotification js
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

#### Installation Order
- First, connect the `jquery` library.
- The rest of the files can be connected in any order.

#### CSS File

Inside the CSS file at the beginning, there are variables that you can change for quick design modification.
You can use these variables to override the design of the notifications.

#### Icons
The Google Font icon library was used during creation.

~ Icons can be replaced with any of your own.

To set your own icons during initialization, specify icons: {} where parameters will be passed for `success`, `warning`, and `error` icons respectively.

Example of setting your own `Font Awesome` icon for the `success`, `warning` events.

```Javascript
const notificationMain = new oneNotification('main-alert', {
    ...
	icons: {
        'success': $('<i>').addClass('fa-solid fa-check'),
        'warning': $('<i>').addClass('fa-solid fa-triangle-exclamation'),
        ...
    },
    ...
});
```

To change the validation icon, use icons: `validation: ...,`.

## Initialization

During the initialization of the `oneNotification` class instance, you can set the following options, which will apply to all notifications in this block.

```javascript
const myNotification = new oneNotification("myNotificationName", {
    position: 'bottomm-center',
    alertsLimit: 5,
    queueLimit: 1000,
    removeLastAlert: false,
    width: '300px',
    
});
```

### Initialization Options

- `position`: Position of notifications on the page. Default is `bottom-center`. Allowed values: `top-left`, `top-center`, `top-right`, `bottom-left`, `bottom-center`, `bottom-right`, `center-center`.
- `alertsLimit`: The maximum number of active notifications on the page. Default is `5`.
- `queueLimit`: The maximum number of notifications in the queue. Default is `1000`.
- `removeLastAlert`: Whether to remove the last notification when `alertsLimit` is reached. Default is `false`. If enabled, it will remove the last notification, except those that are fixed.
- `width`: Width of notifications. Default is `300px`.
- `theme`: Theme setting. Default is `light`.
- `icons`: Setting your own icons. Default is using `google fonts`.
- `debug`: Enable debug mode; loading messages, removal, etc., will be visible in the console.
- By adding a custom name during initialization, you can add your own styles, properties, events for each separate block, e.g., `const myNotification = new oneNotification('myNotificationName', {params})`

### Options for Each notification

When creating each notification, you can set the following options:

- `closeOnTime`: Time in milliseconds after which the notification will close.
- `HTML`: Insert your own HTML code through an array.
- `preConfirm`: Function to perform validation after clicking the "Confirm" button.
- `willOpen`: Function that will trigger upon the opening of the notification.
- `confirmBTN`, `cancelBTN`, `closeBTN`: Show or hide corresponding buttons.
- `fixed`: Pin the notification to the page (it will not disappear when reaching `alertsLimit`, will always be visible).
- `confirmBTNText`, `cancelBTNText`: Text for the "Confirm" and "Cancel" buttons.
- `confirmBTNFocus`, `cancelBTNFocus`: Set focus on the corresponding button (forced setting; if there are multiple focuses, there may be a conflict).
- `type`, `title`, `text`: Type, title, and text of the notification (you can set your own title, or leave it empty, then a standard approach suitable for the situation will be used; `error` -> 'error', `warning` -> 'warning', `success` -> 'success').
- `customClass`: Setting your own class. If you want to add your styles, you can add multiple classes.

### Methods

#### `showNotification(params)`

Displays a notification on the page, taking into account the passed parameters.

```Javascript
notificationMain.showNotification({
    type: 'warning',
    title: 'Add a new user?',
    confirmBTN: true,
    cancelBTN: true,
})
```

#### `showValidationMessage(text, obj)`

This method allows you to display a validation message in a specific notification block.

- `text`: Text of the validation message.
- `obj`: The notification block where the message will be added. By default, this is the `event` from the function.

For proper usage, pass the text as the first argument and the event obtained from the function as the second argument.

#### Example of using HTML and validation:

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

When using the `preConfirm` function, you can also pass an array of any values inside the class; in this case, the `preConfirm` function will be considered successful! If you need to cancel the execution, simply pass `false`.

```Javascript
preConfirm: (event) => {
    notificationMain.showValidationMessage('message', event);
},
```

Or if you prefer, you can display the validation in another block, which you can find by the ID added through `html`.

#### Use .then()

You can use the `then()` keyword to perform an action after closing the notification. Get the closing parameters through any variable used in the function.

```Javascript
.then(result => {
    console.log(result);
});
```

In the result, you will receive the following parameters:

- `isClose`: When the close button is clicked.
- `isConfirm`: When the confirm button is clicked.
- `isCancel`: When the cancel button is clicked.
- `isTimeout`: When the time expires.
- `isLastClose`: When closing, if it was closed while using the `removeLastAlert` = true parameter.

Also, if you have used the `preConfirm` function and returned multiple values, then upon closure through `isConfirm`, you will receive all the parameters you have passed.

## Examples:
### Basic initialization variant

```Javascript
const notificationMain = new oneNotification('main-alert', {
	position: 'bottomm-center',
	alertsLimit: 3,
	width: '320px',
	removeLastAlert: true,
});
```

### Basic call variant

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

### A complex example, using all the functions.

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
            // Executing an ajax request, or another check of yours.
            type: 'POST',
            url: '...',
            data: { 'idRow': idRow, 'password': result.value },
            dataType: 'json',
            success: function (response) {
                response.forEach(response => {
                    notificationMain.showNotification({
                        type: response.status, // Output error or success status
                        text: response.message, // Message
                        closeOnTime: 5000,
                    });
                });
            },
        });
    }
});
```
