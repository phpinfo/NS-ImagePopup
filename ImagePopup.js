var NS = NS || {};
NS.ImagePopup = new Class({
	Implements: [Options, Events, NS.Semaphore],

	options:
	{
	},

	_fx: null,
	
	/**
	 * Initialization
	 *
	 * @param {Hash} options
	 */
	initialize: function(options)
	{
		this.setOptions(options);
	},

	append: function(items)
	{
		items.each(function(item){
			item.addEvent('click', this.popup.bindWithEvent(this, item.get('href')));
		}.bind(this));
	},

	popup: function(event, url)
	{
		event.stop();
		if (!this.isEnabled) return;

		this.disable();

		var cont = this._getContainer(),
			pos = event.target.getPosition(),
			dim = event.target.getDimensions();

		var img = new Image();
		img.onload = function(){
			cont.set('src', url).setStyles({
				left: pos.x,
				top: pos.y,
				width: dim.width,
				height: dim.height
			});
			this._popup(img.width, img.height);
		}.bind(this);
		img.src = url;
	},

	_getContainer: function()
	{
		if (!NS.ImagePopup._cont)
		{
			NS.ImagePopup._cont = new Element('img')
				.setStyles({
					position: 'absolute',
					left: '0px',
					top: '0px',
					visibility: 'hidden'
				})
				.addClass('ns-imagepopup')
				.inject($$('body')[0]);

			document.body.addEvent('click', function(event){
				event.stopPropagation();
				this._hide();
			}.bind(this));

			this._fx = new Fx.Morph(NS.ImagePopup._cont, {duration:100});
		}
		
		return NS.ImagePopup._cont;
	},

	_popup: function(width, height)
	{
		var cont = this._getContainer(),
			win = window.getSize(),
			scr = document.body.getScroll();

		if (width > 500 || height > 500)
		{	
			var W = width, H = height, w = 500, h = 500;
			if (W > H)
				h = H * w / W;
			else
				w = W * h / H;

			width = w;
			height = h;
		}

		cont.fade('show');
		this._fx.start({
			left: (win.x - width)/2 + scr.x,
			top: (win.y - height)/2 + scr.y,
			width: width,
			height: height
		}).chain(this.enable.bind(this));
	},

	_hide: function()
	{
		this._getContainer().fade('hide');
	}
});

NS.ImagePopup._cont = null;