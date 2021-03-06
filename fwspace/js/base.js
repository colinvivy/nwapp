//TODO:make it cool http://html5demos.com/history
JF.M("base",(function(){
	var p ={},pub={},
		gui = require('nw.gui'),
		fs = require('fs');
	
	p.V = {
		tpl0:'No Workspace!',
		$status:$("#appStatus"),
		$tip:$("#appTip"),
		$navCollapse:$("#navCollapse"),
		$secA:$("#secA"),
		updateStatus:function(d){
			if (!d.cnt) {
				this.$status.html(this.tpl0);
				return;
			};
			this.$status.html('Total workspaces: '+d.cnt);
		}
	};

	p.M={
		tipTimer:null,
		isBusy:false
	};

	p.C={
		init:function(){
			JF.base.appRoot = process.execPath.substr(0,process.execPath.lastIndexOf('\\')+1);
			JF.base.dataRoot = JF.base.appRoot+"data\\fwspace\\";
			JF.base.initFile = JF.base.dataRoot+"app.ini";

			//获取工作空间
			if(!JF.opts.ignoreWorkspaceData){
				$(window).on(JF.dataWorkspace.tName+'OnGetAll',function(e,d){

					pub.curWorkspace = JF.data.getCurrentWorkspace(d.items);

					p.V.updateStatus(d);

				});
			}
			

		},
		onLoad:function(){

			$("#btnClose").on("click",function(e){

				var win = gui.Window.get();
				win.close();
				return false;

			});

			$("#btnFullscreen").on("click",function(e){
				var win = gui.Window.get();
				win.toggleFullscreen();
				
				return false;
			});

			$("#btnMinSize").on("click",function(e){
				var win = gui.Window.get();
				win.minimize();
				return false;
			});

			$("#btnNavbar").on("click",function(e){

				if (p.V.$navCollapse.hasClass('in')) {
					p.V.$secA.removeClass('sec_collapsein');
				}else{
					p.V.$secA.addClass('sec_collapsein');
				};

			});

			//minimize to tray
			this.initTray();

			if (!JF.opts.ignoreWorkspaceData) {
				JF.dataWorkspace.getAll();
			};

		},
		initTray:function(){
			// Reference to window and tray
			var win = gui.Window.get(),
				tray;

			// Get the minimize event
			win.on('minimize', function() {
				// Hide window
				this.hide();

				// Show tray
				tray = new gui.Tray({ 
					'icon': 'icon.png'
				});
				tray.tooltip = 'HostSpirit';
				// Show window and remove tray when clicked
				tray.on('click', function() {
					win.show();
					this.remove();
					tray = null;
				});
			});
		}//initTray
	};

	pub.reload = function(){
		var win = gui.Window.get();
		win.reload();
	};

	pub.showTip = function(txt,timeout){
		clearTimeout(p.M.tipTimer);
		p.V.$tip.html(txt).show();
		p.M.isBusy=true;
		if (!timeout) {
			return;
		};
		p.M.tipTimer = setTimeout(function(){

			pub.hideTip();

		},timeout);
	};
	pub.hideTip = function(){
		clearTimeout(p.M.tipTimer);
		p.V.$tip.hide();
		p.M.isBusy = false;
	};

	pub.isBusy = function(){
		return p.M.isBusy;
	};

	pub.onLoad = function(){JF.LoadSub(p);};
	pub.init = function(){JF.InitSub(p);};
	return pub;
})(jQuery));