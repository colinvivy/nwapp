/**
 * websql data api for the app
 * websql reference:http://html5-demos.appspot.com/static/html5storage/index.html
 * Note:physical db file path for node-webkit in win7 :C:\Users\xxxx\AppData\Local\node-webkit\databases
 * You can open the db file using software like sqlite expert
 * UserDataDir:var userDataDir = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
 */
JF.M("data",(function($){
	var p ={},pub={};

	p.C = {
		init:function(){
			JF.db = openDatabase('fwspace','1.0','db for fwspace',4*1024*1024);
			JF.dbLocal = localStorage;
		}
	};

	pub.version = "1.0.1";
	/**
	 * 获取当前工作空间
	 * @param {Array} wsList 工作空间json数组
	 */
	pub.getCurrentWorkspace = function(wsList){
		var item= JF.dbLocal['CurrentWorkspace'];
		if (item) {
			item = JSON.parse(item);
		};
		if (!wsList || wsList.length==0) {
			return item;
		};

		if (!item) {
			item = wsList[0];
			pub.setCurrentWorkspace(item);
			return item;
		};

		var len = wsList.length;
		for (var i = len - 1; i >= 0; i--) {
			if (item.id == wsList[i].id) {
				item = wsList[i];
				pub.setCurrentWorkspace(item);
				break;
			};
		};

		return item;

	};
	/**
	 * 设置当前工作空间
	 * @param {Object} item 工作空间json对象
	 */
	pub.setCurrentWorkspace = function(item){
		JF.dbLocal['CurrentWorkspace'] = JSON.stringify(item);
	};

	/**
	 * 生成insert的sql语句
	 * @param {string} tName 表名
	 * @param {Object} item 业务实体对象
	 */
	pub.getInsertSQL=function(tName,item){
		var sql = "INSERT INTO "+tName+'(',
			fields = [],
			properties = pub.objectPropertyToArray(item),
			cntFields = properties.length;

		sql += properties.join(',');
		sql += ') VALUES ('
		for (var i = cntFields - 1; i >= 0; i--) {
			fields.push('?');
		};
		sql+=fields.join(',');
		sql+=')';

		console.log(sql);

		return sql;

	};
	/**
	 * 生成delete的sql语句
	 * @param {string} tName 表名
	 * @param {Object} item 条件对象
	 */
	pub.getDeleteSQL=function(tName,item){
		var sql = "DELETE FROM "+tName+' WHERE ',
			properties = pub.objectPropertyToArray(item);

		sql += properties.join(' =? AND');
		sql += ' =?';

		console.log(sql);

		return sql;

	};
	/**
	 * 生成update的语句
	 * @param {string} tName 表名
	 * @param {Object} item 业务实体的json对象
	 * @param {string} primaryKey 主键 
	 */
	pub.getUpdateSQL = function(tName,item,primaryKey){
		var fields = pub.objectPropertyToArray(item,[primaryKey]),
			sql = 'UPDATE '+tName +' SET '+fields.join(' = ?, ')+'= ? WHERE '+primaryKey+' = ?';
		return sql;

	};
	/**
	 * 生成createTable的语句
	 * @param {string} tName 表名
	 * @param {Array} fields 字段配置对象数组
	 */
	pub.getTableSQL = function(tName,fields){
		var sql = 'CREATE TABLE IF NOT EXISTS '+tName +'('+fields.join(',')+')';
		return sql;
	};
	/**
	 * 生成查询SQL语句
	 * @param {string} tName 表名
	 * @param {string} filterSql 条件语句
	 */
	pub.getSelectSQL = function(tName,filterSql){
		var sql = 'SELECT * FROM '+tName+(filterSql?' WHERE '+filterSql:'');
		return sql;
	};
	/**
	 * 将列举对象转换成数组
	 * @param {Object} obj json object
	 * @param {Array} ignoreProperties 忽略的属性
	 */
	pub.objectToArray = function(obj,ignoreProperties){
		var retVal = [],
			ignoreProperties = ignoreProperties ||[];
		for (var c in obj) {
			if ($.inArray(c,ignoreProperties)==-1) {
				retVal.push(obj[c]);
			}
		};
		return retVal;
	};

	/**
	 * 将列举对象的属性转换成数组
	 * @param {Object} obj json object
	 * @param {Array} ignoreProperties 忽略的属性
	 */
	pub.objectPropertyToArray = function(obj,ignoreProperties){
		var retVal = [],
			ignoreProperties = ignoreProperties ||[];
		for (var c in obj) {
			if ($.inArray(c,ignoreProperties)==-1) {
				retVal.push(c);
			};
		};
		return retVal;
	};

	
	pub.onLoad = function(){JF.LoadSub(p);};
	pub.init = function(){JF.InitSub(p);};

	return pub;
})(jQuery));