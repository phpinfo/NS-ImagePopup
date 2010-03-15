var NS = NS || {};
NS.ImagePopup = new Class({

	/**
	 * Appending new items
	 *
	 * @param {Elements}
	 */
	append: function(items)
	{
		items.each(function(item){
			item.addEvent('click', this._popup.bindWithEvent(this, item.get('href')));
		}.bind(this));
	},

	/**
	 * Link click event handler
	 * 
	 * @param {Event} event
	 * @param {String} url to open
	 */
	_popup: function(event, url)
	{
		event.stop();

		// Blogspot images filtration
		if (url.indexOf('blogspot.com') >= 0)
			url = url.replace('-h/', '/');

		var pos = event.target.getPosition(),
			dim = event.target.getDimensions(),
			img = new Image();

		img.onload = function(){
			// Setting container start position and dimensions
			this._getContainer().set('src', url).setStyles({
				left: pos.x,
				top: pos.y,
				width: dim.width,
				height: dim.height
			});

			// Showing container
			this._show(img.width, img.height);
		}.bind(this);

		// Image load error
		img.onerror = function(){
			alert('Error occured while loading "'+url+'"');
		}.bind(this)

		// Setting image src
		img.src = url;
	},

	/**
	 * Show container
	 * 
	 * @param {Number} width
	 * @param {Number} height
	 */
	_show: function(width, height)
	{
		var cont = this._getContainer(),
			win = window.getSize(),
			scr = document.body.getScroll();
		
		if (width > win.x || height > win.y)
		{
			var w = win.x - 0.05 * win.x, h = win.y - 0.05 * win.y;
			if (w < h)
				h = height * w / width;
			else
				w = width * h / height;

			width = w;
			height = h;
		}

		cont.fade('show');
		this._getFx().start({
			left: (win.x - width)/2 + scr.x,
			top: (win.y - height)/2 + scr.y,
			width: width,
			height: height
		});
	},

	/**
	 * Hide container
	 * 
	 */
	_hide: function()
	{
		this._getContainer().fade('hide').setStyles({
			width: 0,
			height: 0
		});
	},

	/**
	 * Retrieving container
	 * 
	 * @return {Element}
	 */
	_getContainer: function()
	{
		if (NS.ImagePopup._cont === null)
		{
			NS.ImagePopup._cont = new Element('img')
				.setStyles({
					'position': 'absolute',
					'z-index': 999,
					'left': 0,
					'top': 0,
					'width': 0,
					'height': 0,
					'visibility': 'hidden'
				})
				.addClass('ns-imagepopup')
				.inject($$('body')[0]);

			document.body.addEvent('click', function(event){
				event.stopPropagation();
				this._hide();
			}.bind(this));
		}
		return NS.ImagePopup._cont;
	},

	/**
	 * Retrieving animation effect
	 * 
	 * @return {Fx}
	 */
	_getFx: function()
	{
		if (NS.ImagePopup._fx === null)
			NS.ImagePopup._fx = new Fx.Morph(NS.ImagePopup._cont, {duration: 200});
		return NS.ImagePopup._fx;
	}
});

/**
 * Popup container
 *
 * @var {Element}
 */
NS.ImagePopup._cont = null;

/**
 * Container effect
 *
 * @var {Fx}
 */
NS.ImagePopup._fx = null;