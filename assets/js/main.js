/* Portfolio interactions: dependency-free and keyboard accessible. */
(function () {
	'use strict';

	window.addEventListener('load', function () {
		document.body.classList.remove('is-preload');
	});

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		document.querySelectorAll('[data-reduced-motion-src]').forEach(function (image) {
			image.src = image.dataset.reducedMotionSrc;
		});
	}

	var skipLink = document.querySelector('.skip-link');
	var mainContent = document.getElementById('main-content');
	if (skipLink && mainContent) {
		skipLink.addEventListener('click', function () {
			mainContent.focus();
		});
	}

	document.querySelectorAll('.project-toggle').forEach(function (button) {
		button.addEventListener('click', function () {
			var details = document.getElementById(button.dataset.target);
			if (!details) return;

			var isOpening = details.classList.contains('hidden');
			details.classList.toggle('hidden', !isOpening);
			button.setAttribute('aria-expanded', String(isOpening));
			button.textContent = isOpening ? 'Hide case study' : 'View case study';

			var label = button.getAttribute('aria-label') || '';
			button.setAttribute('aria-label', label.replace(/^(View|Hide)/, isOpening ? 'Hide' : 'View'));
		});
	});

	document.querySelectorAll('.work-image-slider').forEach(function (gallery, galleryIndex) {
		var images = Array.from(gallery.querySelectorAll('img'));
		if (images.length < 2) return;

		var currentIndex = 0;
		var label = gallery.dataset.galleryLabel || 'Experience image gallery';
		gallery.setAttribute('role', 'group');
		gallery.setAttribute('aria-label', label);

		var controls = document.createElement('div');
		controls.className = 'gallery-controls';

		var previous = document.createElement('button');
		previous.type = 'button';
		previous.className = 'gallery-button';
		previous.textContent = 'Previous';
		previous.setAttribute('aria-label', 'Previous image in ' + label);

		var status = document.createElement('span');
		status.className = 'gallery-status';
		status.id = 'gallery-status-' + galleryIndex;
		status.setAttribute('aria-live', 'polite');

		var next = document.createElement('button');
		next.type = 'button';
		next.className = 'gallery-button';
		next.textContent = 'Next';
		next.setAttribute('aria-label', 'Next image in ' + label);

		function showImage(index) {
			currentIndex = (index + images.length) % images.length;
			images.forEach(function (image, imageIndex) {
				image.hidden = imageIndex !== currentIndex;
			});
			status.textContent = (currentIndex + 1) + ' / ' + images.length;
		}

		previous.addEventListener('click', function () { showImage(currentIndex - 1); });
		next.addEventListener('click', function () { showImage(currentIndex + 1); });

		controls.append(previous, status, next);
		gallery.insertAdjacentElement('afterend', controls);
		showImage(0);
	});

	document.querySelectorAll('.show-more-media').forEach(function (button) {
		var container = document.getElementById(button.getAttribute('aria-controls'));
		if (!container) return;

		button.addEventListener('click', function () {
			if (!container.dataset.loaded) {
				var media = [
					{ type: 'img', src: 'images/W_2_env.jpg', alt: 'ROV prototype in an outdoor test environment', width: 1280, height: 1707 },
					{ type: 'img', src: 'images/W_2_env2.jpg', alt: 'ROV equipment prepared beside the water', width: 1920, height: 1080 },
					{ type: 'video', src: 'images/W_2_boat.mp4', label: 'ROV support platform demonstration' },
					{ type: 'video', src: 'images/W_2_video.mp4', label: 'ROV test demonstration' }
				];

				media.forEach(function (item) {
					if (item.type === 'img') {
						var image = document.createElement('img');
						image.src = item.src;
						image.alt = item.alt;
						image.width = item.width;
						image.height = item.height;
						image.loading = 'lazy';
						image.decoding = 'async';
						container.appendChild(image);
					} else {
						var video = document.createElement('video');
						video.controls = true;
						video.preload = 'none';
						video.setAttribute('aria-label', item.label);

						var source = document.createElement('source');
						source.src = item.src;
						source.type = 'video/mp4';
						video.appendChild(source);
						container.appendChild(video);
					}
				});

				container.dataset.loaded = 'true';
			}

			var isOpening = container.hidden;
			container.hidden = !isOpening;
			button.setAttribute('aria-expanded', String(isOpening));
			button.textContent = isOpening ? 'Hide additional media' : 'Show additional media';
		});
	});
}());
