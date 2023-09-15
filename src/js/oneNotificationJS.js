class oneNotification {
	#alertsOnPage = [];
	#equen = [];
	#notificationWrapper = $('<div>').addClass('one-notification-wrapper');
	#wrapperOnPage = false;

	constructor(name, options) {
		this.name = name;
		this.position = options.position || 'bottom-center';
		this.alertsLimit = options.alertsLimit || 5;
		this.equeLimit = options.equeLimit || 1000;
		this.removeLastAlert = options.removeLastAlert || false;
		this.debug = false;
		this.width = options.width || '300px';
		this.theme = options.theme || 'light';
		this.iconsPack = options.icons != null && typeof options.icons === 'object' ? options.icons : null;
	}

	async showNotification(params) {
		return new Promise(async (resolve) => {
			if (this.debug) { // debug
				console.warn('showNotification was called');
			}
			// Если привышен лимит
			if (this.#equen.length >= this.equeLimit) {
				console.warn('Equen is full.');
				return;
			}

			// Перед открытием
			if (params.willOpen && typeof params.willOpen === 'function') {
				await params.willOpen();
			}

			// Создаем блок
			const notificationBox = $('<div>').addClass(`one-notification-box ${params.type}`).css('width', this.width);

			// Устновка значений
			const value = {
				obj: notificationBox, // const
				timerID: null, // const
				resolve: resolve, // const
				fixed: params.fixed != null ? params.fixed : false, // default - false
				closeBTN: params.closeBTN != null ? params.closeBTN : true, // default - true
				closeOnTime: params.closeOnTime || null, // default - null
			};

			// title: custom/default

			// Создания контейнеров для контента - Основных
			const iconContainer = $('<div>').addClass('notification-container icon');
			const titleContainer = $('<div>').addClass('notification-container title');
			const textContainer = $('<div>').addClass('notification-container text');
			const customHTMLContainer = $('<div>').addClass('notification-container html');
			const buttonContainer = $('<div>').addClass('notification-container button');

			// Создания основных блоков
			const icon = $('<div>').addClass('notification-icon');
			const title = $('<div>').addClass('notification-title');
			const text = $('<div>').addClass('notification-text');

			const closeButton = $('<div>').addClass('notification-close');
			closeButton.append($('<span>').addClass('material-icons-outlined').text('highlight_off'))

			// Загрузка основного контента
			const icons = {
				'success': $('<span>').addClass('material-icons-round').text('expand_circle_down'),
				'warning': $('<span>').addClass('material-icons-round').text('warning'),
				'error': $('<span>').addClass('material-icons-round').text('error'),
			};
			['error', 'warning', 'success'].forEach((item, index) => {
				if (item == params.type) {
					if (this.iconsPack != null && typeof this.iconsPack === 'object' && this.iconsPack[item] != null) {
						icon.append(this.iconsPack[item].clone());
					} else {
						icon.append(icons[item]);
					}
				}
			});

			text.text(params.text);
			params.title != null ? title.text(params.title) : title.text(params.type); // Title кастомный или по-умолчанию

			// Настройки выбраные пользователем
			if (!value.closeBTN) { // Отключение кнопки
				notificationBox.addClass('no-close');
			} else {
				closeButton.click(() => {
					this.closeNotification(notificationBox);
					resolve({ isClose: true });
					return;
				});
			}

			if (value.fixed) { // Установки фиксирован ли блок
				notificationBox.addClass('fixed');
			}

			if (params.closeOnTime) { // Закрытие через время
				const timer = $('<div>').addClass('notification-container timer');
				const timeSpan = $('<span>').addClass('time');
				timeSpan.css('animation-duration', params.closeOnTime + 'ms')

				timer.append(timeSpan);
				notificationBox.append(timer);
			}

			if (params.customClass) { // Установка кастомного класса
				if (Array.isArray(params.customClass)) {
					params.customClass.forEach(item => {
						notificationBox.addClass(item);
					});
				} else notificationBox.addClass(params.customClass);
			}

			// Установка кнопок
			let confirmBTN = params.confirmBTN ? params.confirmBTN : false;
			let cancelBTN = params.cancelBTN ? params.cancelBTN : false;
			if (cancelBTN || confirmBTN) {
				let confirmBTNText = params.confirmBTNText ? params.confirmBTNText : 'confirm';
				let cancelBTNText = params.cancelBTNText ? params.cancelBTNText : 'cancel';

				let focusConfirm = params.confirmBTNFocus ? true : false;
				let focusCancel = params.cancelBTNFocus ? true : false;
				if (confirmBTN) {
					const $button = $('<button>').addClass('btn btn-confirm').text(confirmBTNText).prop('autofocus', focusConfirm);
					focusConfirm ? $button.addClass('focus-on') : null;
					buttonContainer.append($button);
					$button.on('click', () => {
						if (params.preConfirm && typeof params.preConfirm === 'function') {
							const isPreConfirm = params.preConfirm(notificationBox);
							if (!isPreConfirm) return;

							resolve({ isConfirm: true, value: isPreConfirm });
						}
						else {
							resolve({ isConfirm: true });
						}
						this.closeNotification(notificationBox);
						return;
					});
				}
				if (cancelBTN) {
					const $button = $('<button>').addClass('btn btn-cancel').text(cancelBTNText).prop('autofocus', focusCancel);
					focusCancel ? $button.addClass('focus-on') : null;
					buttonContainer.append($button);
					$button.on('click', () => {
						this.closeNotification(notificationBox);
						resolve({ isCancel: true });
						return;
					});
				}
				notificationBox.prepend(buttonContainer);
			}

			// html вставка
			if (params.html && typeof params.html === 'object') {
				params.html.forEach(item => {
					customHTMLContainer.append(item);
				});
				notificationBox.prepend(customHTMLContainer);
			}

			// Вставка в контейнеры
			iconContainer.append(icon);
			titleContainer.append(title);
			textContainer.append(text);

			// Вставка в основной блок
			notificationBox.prepend(iconContainer, titleContainer, textContainer, closeButton);

			// Добавляем в очередь
			this.#equen.push(value);

			this.updateNotifications();
		});
	}

	updateNotifications() {
		if (this.debug) {
			console.warn('updateNotifications was called');
		}
		if (!this.#wrapperOnPage) {
			if (this.position == 'center-center') {
				$('body').append(
					this.#notificationWrapper
						.addClass(this.name)
						.addClass(this.position)
						.addClass(this.theme)
				);
			}
			else {
				const standardVerticals = ['top', 'bottom'];
				const standardHorizontals = ['left', 'right', 'center'];

				const [vertical, horizontal] = this.position.split('-');

				const verticalToUse = standardVerticals.includes(vertical) ? vertical : 'top';
				const horizontalToUse = standardHorizontals.includes(horizontal) ? horizontal : 'left';

				$('body').append(
					this.#notificationWrapper
						.addClass(this.name)
						.addClass([verticalToUse, horizontalToUse])
						.addClass(this.theme)
				);
			}

			this.#wrapperOnPage = true;
		}

		let currentAlertCount = this.#alertsOnPage.length;

		this.#equen.forEach((item) => {
			if (currentAlertCount < this.alertsLimit) {
				item.obj.addClass('animation-show');
				item.obj.appendTo(this.#notificationWrapper);
				item.obj.find('.focus-on') ? item.obj.find('.focus-on').focus() : null;
				this.#alertsOnPage.push(item);
				this.#equen = this.#equen.filter(alert => alert.obj !== item.obj);
				currentAlertCount++;

				if (item.closeOnTime) {

					item.timerID = setTimeout(() => {
						if (this.debug) {
							console.warn('setTimeout was called');
						}
						this.closeNotification(item.obj);
						item?.resolve({ isTimeout: true });
					}, item.closeOnTime);

					const timeSpan = item.obj.find('.time');
					timeSpan.addClass('animation-time');
				}
			} else if (this.removeLastAlert) {
				let firstRemoveItem = this.#alertsOnPage.find(item => !item.fixed);
				if (firstRemoveItem.delition) {
					return;
				}
				firstRemoveItem.delition = true;
				if (firstRemoveItem) {
					this.closeNotification(firstRemoveItem.obj);
					firstRemoveItem?.resolve({ isLastClose: true });
				}
			}
		});

		if (this.#alertsOnPage.length === 0 && this.#wrapperOnPage) {
			this.#notificationWrapper.remove();
			this.#wrapperOnPage = false;
		}
	}

	closeNotification(notification) {
		if (this.debug) {
			console.warn('closeNotification was called');
		}
		let item = this.#alertsOnPage.find(alert => alert.obj === notification)
			|| this.#equen.find(alert => alert.obj === notification);

		if (item) {
			item.obj.addClass('animation-hide');

			if (item.timerID !== null) {
				if (this.debug) {
					console.warn('clearTimeout was called');
				}
				clearTimeout(item.timerID);
			}

			setTimeout(() => {
				this.#alertsOnPage = this.#alertsOnPage.filter(alert => alert.obj !== item.obj);
				this.#equen = this.#equen.filter(alert => alert.obj !== item.obj);

				this.updateNotifications();
				item.obj.remove();
			}, 450);

		} else {
			console.warn('Notification not found.');
		}
	}

	showValidationMessage(text, obj) {
		const item = this.#alertsOnPage.find(item => item.obj === obj);
		item.obj.find('.notification-container.validation').remove();

		const containerValidation = $('<div>').addClass('notification-container validation');
		const iconValidation =
			this.icons != null && this.icons['validation'] ?
				this.icons['validation'] :
				$('<span>').addClass('icon material-icons-outlined').text('feedback');
		const spanText = $('<span>').addClass('validation-text').text(text);

		containerValidation.append(iconValidation, spanText);

		item.obj.find('.notification-container.html').after(containerValidation);
	}

}
