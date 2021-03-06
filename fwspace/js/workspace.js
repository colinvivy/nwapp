JF.M("workspace",(function($){
	var p ={},pub={};
	
	p.V = {
		$list:$("#wsListBd"),
		tpl:$("#tplWSItem").html(),
		tpl0:'<tr><td colspan="9"><div class="alert alert-info">没有任何工作空间</div></td></tr>',
		fillData:function(d){
			if(d.cnt==0){
				this.$list.append(this.tpl0);
				return;
			}
			var cnt = d.cnt,
				html = [];
			for (var i = cnt - 1; i >= 0; i--) {
				html.push(JF.EvalTpl(this.tpl,d.items[i]));
			};
			this.$list.append(html.join(''));
		}
	};

	p.C = {
		init:function(){
			$(window).on(JF.dataWorkspace.tName+'OnGetAll',function(e,d){
				p.V.fillData(d);
			});
		},
		onLoad:function(){

			p.V.$list.on('dblclick','.tr_wsitem',function(e){

				var id = this.getAttribute('data-id');

				JF.editorWorkspace.showEdit(id);

				return false;
			});
		}
	};
	
	pub.onLoad = function(){JF.LoadSub(p);};
	pub.init = function(){JF.InitSub(p);};
	return pub;
})(jQuery));