mapboxgl.accessToken = 'pk.eyJ1IjoiYnJlbmRhbmJlcmciLCJhIjoiWXVvZHV6VSJ9.6wcfcCqUfRnFd2EUT_9QGw';

// Mobile device detection
var isMobile = false;

if (
	/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
		navigator.userAgent,
	) ||
	/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
		navigator.userAgent.substr(0, 4),
	)
) {
	isMobile = true;
}

const API_BASE_URL = 'api.lobbyart.org';

const bounds = [
	[-74.08, 40.67],
	[-73.864, 40.9],
];

const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/brendanberg/cikk9vbhw003hsykput8wm6ry',
	center: [-73.989, 40.738],
	zoom: 13,
	logoPosition: isMobile ? 'top-left' : 'bottom-left',
	attributionControl: false,
	maxBounds: bounds,
	minZoom: 12,
	maxZoom: 17,
});

if (isMobile) {
	map.addControl(
		new mapboxgl.AttributionControl({
			compact: true,
		}),
		'top-right',
	);
} else {
	map.addControl(
		new mapboxgl.AttributionControl({
			compact: true,
		}),
		'top-right',
	).addControl(
		new mapboxgl.NavigationControl({
			showCompass: false,
			showZoom: true,
		}),
		'top-left',
	);
}

const suggestionForm = document.getElementById('tip-line');

const categoryButton = document.getElementById('categories');
const aboutButton = document.getElementById('about');
const suggestionFormButton = document.getElementById('suggestion');

const categoryPane = document.getElementById('legend-categories');
const aboutPane = document.getElementById('legend-about');
const suggestionFormPane = document.getElementById('legend-suggestion');

const menuButton = document.getElementById('menu-control');
const menuContainer = document.getElementById('legend-content');
const logoRegion = document.getElementById('logo-region');

categoryButton.addEventListener('click', (e) => {
	aboutPane.classList.add('hidden');
	suggestionFormPane.classList.add('hidden');
	categoryPane.classList.toggle('hidden');
});

aboutButton.addEventListener('click', (e) => {
	categoryPane.classList.add('hidden');
	suggestionFormPane.classList.add('hidden');
	aboutPane.classList.toggle('hidden');
});

suggestionFormButton.addEventListener('click', (e) => {
	aboutPane.classList.add('hidden');
	categoryPane.classList.add('hidden');
	suggestionFormPane.classList.toggle('hidden');
});

logoRegion.addEventListener('click', (e) => {
	if (menuContainer.classList.contains('closed')) {
		categoryButton.classList.remove('hidden');
		aboutButton.classList.remove('hidden');
		suggestionFormButton.classList.remove('hidden');

		menuContainer.classList.remove('closed');
		menuContainer.classList.add('open');
	}
});

menuButton.addEventListener('click', (e) => {
	if (menuContainer.classList.contains('open')) {
		categoryButton.classList.add('hidden');
		categoryPane.classList.add('hidden');
		aboutPane.classList.add('hidden');
		aboutButton.classList.add('hidden');
		suggestionFormPane.classList.add('hidden');
		suggestionFormButton.classList.add('hidden');

		menuContainer.classList.remove('open');
		menuContainer.classList.add('closed');
	} else {
		categoryButton.classList.remove('hidden');
		aboutButton.classList.remove('hidden');
		suggestionFormButton.classList.remove('hidden');

		menuContainer.classList.remove('closed');
		menuContainer.classList.add('open');
	}
	e.stopPropagation();
});

const photo = document.querySelector("input[type='file']#photo");

photo.addEventListener('change', (e) => {
	const fileNameSpan = document.querySelector('label.file p#file-name');

	if (e.target.files.length > 0) {
		const [file] = e.target.files;
		const { name: fileName, size } = file;

		let fileSize;

		if (size > 1000000000) {
			fileSize = `${(size / 1000000000).toFixed(1)} GB`;
		} else if (size > 1000000) {
			fileSize = `${(size / 1000000).toFixed(1)} MB`;
		} else if (size > 1000) {
			fileSize = `${(size / 1000).toFixed(1)} KB`;
		} else {
			fileSize = `${size} bytes`;
		}

		fileNameSpan.classList.remove('placeholder');
		fileNameSpan.textContent = fileName;
		document.querySelector('label.file p#file-size').textContent = fileSize;
	} else {
		fileNameSpan.classList.add('placeholder');
		fileNameSpan.textContent = '(no image selected)';
		document.querySelector('label.file p#file-size').textContent = '';
	}
});

suggestionForm.addEventListener('focusout', (e) => {
	const currentField = e.target;

	if (currentField.getAttribute('type') === 'text') {
		currentField.value = currentField.value.trim();

		if (currentField.value.length == 0) {
			currentField.classList.add('form-error');
		} else {
			currentField.classList.remove('form-error');
		}
	}
});

suggestionForm.addEventListener('input', (e) => {
	const currentField = e.target;
	const submitButton = currentField.parentElement.querySelector('input[type="submit"]');

	let formIsValid = true;

	currentField.parentElement.querySelectorAll('input[type="text"]').forEach((input) => {
		if (input.value.length < 1) {
			formIsValid = false;
		}
	});

	submitButton.disabled = !formIsValid;
});

suggestionForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	const form = e.target;
	const submitButton = form.querySelector('#submit');

	const address = form.querySelector('#address');
	const artist = form.querySelector('#name');
	const title = form.querySelector('#title');
	const photo = form.querySelector('#photo');
	let distributionUrl = undefined;

	submitButton.disabled = true;
	submitButton.value = 'Uploading...';

	address.disabled = true;
	artist.disabled = true;
	title.disabled = true;
	photo.disabled = true;

	try {
		if (photo.files.length > 0) {
			const uploadUrl = await axios({
				method: 'get',
				url: `https://${API_BASE_URL}/media_upload_url`,
			});

			if (uploadUrl.status == 200) {
				distributionUrl = uploadUrl.data['distributionURL'];

				const uploadResult = await axios({
					method: 'put',
					url: uploadUrl.data['uploadURL'],
					data: photo.files[0],
					headers: {
						'Content-Type': photo.files[0].type,
					},
				});
			}
		}
	} catch (error) {
		console.error('Error uploading photo.');
		// TODO: Can we split this up so we retry the S3 upload?

		if (error.response) {
			// 1. The server responded with a status code outside the 2xx range
			// Examples: 400, 401, 404, 500
			console.error('Server Error Data', error.response.data);
			console.error('Status Code', error.response.status);
			console.error('Headers', error.response.headers);
		} else if (error.request) {
			// 2. The request was made but no response was received
			// Examples: Network down, server offline, CORS issues
			console.error('Network/No Response Error', error.request);
		} else {
			// 3. Something happened in setting up the request that triggered an Error
			console.error('Axios Setup Error', error.message);
		}

		// Always log the full config if debugging
		console.log('Error details', error.config);
	}

	try {
		const work = await axios({
			method: 'post',
			url: `https://${API_BASE_URL}/works`,
			data: {
				Address: address.value,
				Artist: artist.value,
				Title: title.value,
				ImageURL: distributionUrl,
			},
		});

		form.reset();
		photo.dispatchEvent(new Event('change', { bubbles: true, target: photo }));
		submitButton.value = 'Thank you!';
		submitButton.classList.add('thankyou');

		window.setTimeout(() => {
			submitButton.value = 'Submit';
			submitButton.classList.remove('thankyou');

			address.disabled = false;
			artist.disabled = false;
			title.disabled = false;
			photo.disabled = false;
		}, 1000);
	} catch (error) {
		submitButton.value = 'Something went wrong. Please try again.';
		submitButton.classList.remove('thankyou');
		submitButton.classList.add('error');
		address.disabled = false;
		artist.disabled = false;
		title.disabled = false;
		photo.disabled = false;

		if (error.response) {
			// 1. The server responded with a status code outside the 2xx range
			// Examples: 400, 401, 404, 500
			console.error('Server Error Data', error.response.data);
			console.error('Status Code', error.response.status);
			console.error('Headers', error.response.headers);
		} else if (error.request) {
			// 2. The request was made but no response was received
			// Examples: Network down, server offline, CORS issues
			console.error('Network/No Response Error', error.request);
		} else {
			// 3. Something happened in setting up the request that triggered an Error
			console.error('Axios Setup Error', error.message);
		}

		// Always log the full config if debugging
		console.log('Error details', error.config);

		// There was an error...

		window.setTimeout(() => {
			submitButton.value = 'Submit';
			submitButton.classList.remove('error');
			submitButton.dispatchEvent(new Event('input', { bubbles: true, target: submitButton }));
		}, 2000);
	}
});

const markerColors = {
	'private-lobby': '#c0392b',
	'private-outdoor': '#e67e22',
	'public-lobby': '#2980b9',
	'public-outdoor': '#16a085',
};

const template = {
	type: 'Template',
	expressionList: [
		{ type: 'Literal', string: '<p>' },
		{
			type: 'Block',
			name: { type: 'Name', name: 'if' },
			expression: {
				type: 'Expression',
				searchPath: [{ type: 'Name', name: 'Location' }],
			},
			consequent: {
				type: 'Template',
				expressionList: [
					{ type: 'Literal', string: '<span class="title">' },
					{
						type: 'Expression',
						searchPath: [{ type: 'Name', name: 'Location' }],
					},
					{ type: 'Literal', string: '</span>' },
					{
						type: 'Block',
						name: { type: 'Name', name: 'if' },
						expression: {
							type: 'Expression',
							searchPath: [{ type: 'Name', name: 'Address' }],
						},
						consequent: {
							type: 'Template',
							expressionList: [
								{ type: 'Literal', string: '<br>' },
								{
									type: 'Expression',
									searchPath: [{ type: 'Name', name: 'Address' }],
								},
							],
						},
					},
				],
			},
			alternative: {
				type: 'Template',
				expressionList: [
					{ type: 'Literal', string: '<span class="title">' },
					{
						type: 'Expression',
						searchPath: [{ type: 'Name', name: 'Address' }],
					},
					{ type: 'Literal', string: '</span>' },
				],
			},
		},
		{ type: 'Literal', string: '</p>' },
		{
			type: 'Block',
			name: { type: 'Name', name: 'if' },
			expression: {
				type: 'Expression',
				searchPath: [{ type: 'Name', name: 'Image' }],
			},
			consequent: {
				type: 'Template',
				expressionList: [
					{
						type: 'Literal',
						string: '<div class="image" style="background-image: url(\'',
					},
					{
						type: 'Expression',
						searchPath: [{ type: 'Name', name: 'Image' }],
					},
					{ type: 'Literal', string: '\')"></div>' },
				],
			},
		},
		{ type: 'Literal', string: '<p><strong>' },
		{ type: 'Expression', searchPath: [{ type: 'Name', name: 'Artist' }] },
		{ type: 'Literal', string: '</strong><br><em>' },
		{ type: 'Expression', searchPath: [{ type: 'Name', name: 'Title' }] },
		{ type: 'Literal', string: '</em></p>' },
	],
};

map.on('load', () => {
	// We start with the Collection Filters pane open and close it when the
	// map finishes loading.
	categoryButton.classList.add('hidden');
	aboutButton.classList.add('hidden');
	suggestionFormButton.classList.add('hidden');
	menuContainer.classList.remove('open');
	menuContainer.classList.add('closed');

	map.addSource('works', {
		type: 'geojson',
		cluster: true,
		clusterMaxZoom: 14, // Max zoom to cluster points on
		clusterRadius: 30, // Radius of each cluster when clustering points (defaults to 50)
		data: 'https://api.lobbyart.org/works.geojson',
	});

	// Load marker images
	map.loadImage('/assets/pin-s+c0392b.png', (error, image) => {
		map.addImage('private-lobby', image);
	});
	map.loadImage('/assets/pin-s+e67e22.png', (error, image) => {
		map.addImage('private-outdoor', image);
	});
	map.loadImage('/assets/pin-s+2980b9.png', (error, image) => {
		map.addImage('public-lobby', image);
	});
	map.loadImage('/assets/pin-s+16a085.png', (error, image) => {
		map.addImage('public-outdoor', image);
	});

	map.addLayer({
		id: 'cluster-circle',
		type: 'circle',
		source: 'works',
		filter: ['has', 'point_count'],
		paint: {
			'circle-color': '#a7d3f0',
			'circle-radius': 25,
			'circle-stroke-width': 3,
			'circle-stroke-color': '#2980b9',
			'circle-opacity': 0.6,
		},
	});

	map.addLayer({
		id: 'cluster-count',
		type: 'symbol',
		source: 'works',
		filter: ['has', 'point_count'],
		layout: {
			// 'text-field': ['get', 'point_count_abbreviated'],
			'text-field': ['get', 'point_count'],
			'text-font': ['DIN Pro Bold'],
			'text-size': 18,
		},
		paint: {
			'text-color': '#2980b9',
		},
	});

	map.addLayer({
		id: 'private-lobby',
		type: 'symbol',
		source: 'works',
		filter: ['==', ['get', 'feature-type'], 'private-lobby'],
		layout: { 'icon-image': '{feature-type}', visibility: 'visible' },
	});

	map.addLayer({
		id: 'private-outdoor',
		type: 'symbol',
		source: 'works',
		filter: ['==', ['get', 'feature-type'], 'private-outdoor'],
		layout: { 'icon-image': '{feature-type}', visibility: 'visible' },
	});

	// Show popup cards when markers are clicked
	map.on('click', (e) => {
		const features = map.queryRenderedFeatures(e.point, {
			layers: ['private-lobby', 'private-outdoor'],
		});

		if (!features.length) {
			return;
		}

		const feature = features[0];
		// TODO: Replace strudel template with React component
		const popupTemplate = Strudel.load(template);

		// const popupElt = (
		// 	<div>
		// 		{(feature.properties.Location && (
		// 			<p>
		// 				<span class="title">{feature.properties.Location}</span>
		// 				{feature.properties.Address && (
		// 					<br>{feature.properties.Address}</br>
		// 				)}
		// 				<br>{feature.properties.Title}</br>
		// 			</p>
		// 		)) || (
		// 			<p>
		// 				<span class="title">{feature.properties.Address}</span>
		// 				<br>{feature.properties.Title}</br>
		// 			</p>
		// 		)}
		// 		{feature.properties.Image && (
		// 			<div
		// 				class="image"
		// 				style="background-image: url(\'{feature.properties.Image}\')"
		// 			></div>
		// 		)}
		// 	</div>
		// );
		// console.log(popupElt);

		const popup = new mapboxgl.Popup({
			offset: 20,
			closeButton: true,
			maxWidth: '500px',
		})
			.setLngLat(feature.geometry.coordinates)
			.setHTML(popupTemplate(feature.properties))
			.addTo(map);
	});

	// Change cursor to pointer when hovering over markers
	map.on('mousemove', (e) => {
		const features = map.queryRenderedFeatures(e.point, {
			layers: ['private-lobby', 'private-outdoor'],
		});
		map.getCanvas().style.cursor = features.length ? 'pointer' : '';
	});

	// Select layer filter checkboxes and connect layer visibility changes
	document.querySelectorAll('input.marker').forEach((elt) => {
		elt.addEventListener('click', (e) => {
			const layerName = e.target.getAttribute('data-layer-name');
			e.stopPropagation();

			const visibility = map.getLayoutProperty(layerName, 'visibility');

			if (visibility === 'visible') {
				map.setLayoutProperty(layerName, 'visibility', 'none');
			} else {
				map.setLayoutProperty(layerName, 'visibility', 'visible');
			}
		});
	});
});

//https://api.mapbox.com/geocoding/v5/mapbox.places/401%20broadway.json?access_token=pk.eyJ1IjoiYnJlbmRhbmJlcmciLCJhIjoiWXVvZHV6VSJ9.6wcfcCqUfRnFd2EUT_9QGw&cachebuster=1560399326898&autocomplete=true&country=us&types=address&proximity=-73.99425476311615%2C40.74389042077257
