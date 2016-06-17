(function (_) {
	/**
	 * 基本模板设置
	 */
	function Template() {
		// 课程模板
		this.courseTemplate
		=	'<div class="m-course" data-index="{{index}}" data-id="{{id}}">\
                <a href="##"><img src="{{middlePhotoUrl}}" alt="{{name}}"></a>\
                <h5 class="f-toe"><a href="##">{{name}}</a></h5>\
                <div class="course-author">\
                    <a href="##">{{provider}}</a>\
                    <div class="wrap"><div class="u-participate"><i></i>{{learnerCount}}</div></div>\
                </div>\
            	<div class="course-price">{{price}}</div>\
                <div class="course-wrap f-dn" data-id="{{id}}">\
	                <a href="##"><img src="{{middlePhotoUrl}}" alt="{{name}}"></a>\
	                <h5 class="f-toe"><a href="##">{{name}}</a></h5>\
	                <div class="u-participate"><i></i>{{learnerCount}}人在学</div>\
	                <div class="course-info">\
	                    <div>发布者：<span class="pulish">{{provider}}</span></div>\
	                    <div>分类：<span class="sort">{{categoryName}}</span></div>\
	                </div>\
	                <div class="course-details">\
	                    <p>{{description}}</p>\
	                </div>\
	            </div>\
            </div>';
	}

	/**
	 * 根据数据创建所有课程的html
	 *
	 * @param {object} data 传入的课程数据
	 * @returns {string} HTML 
	 *
	 * @example
	 * view.courseShow( [{"id":"967019",//课程 ID 
		  "name":"和秋叶一起学职场技能",//课程名称 
		  "bigPhotoUrl":"http://img1.ph.126.net/eg62.png",//课程大图 
		  " middlePhotoUrl ":"http://img1.ph.126.net/eg62.png",//课程中图 
		  "smallPhotoUrl":" http://img1.ph.126.net/eg62.png ",//课程小图 
		  " provider ":"秋叶",//机构发布者 
		  " learnerCount ":"23",//在学人数 
		  " price ":"128",//课程价格，0为免费 
		  "categoryName ":"办公技能",//课程分类 
		  "description ":"适用人群：最适合即将实习、求职、就职的大学生，
		入职一、二三年的新人。别以为那些职场老人都知道！"//课程描述 
		}] );
	 */
	Template.prototype.courseShow = function (data) {
		var i, l;
		var view = '';

		for (i = 0, l = data.length; i < l; i++) {
			var template = this.courseTemplate;
			var price = data[i].price === 0? '免费' : ('￥'+data[i].price);

			template = template.replace(/{{index}}/g , i);
			template = template.replace(/{{id}}/g, data[i].id);
			template = template.replace(/{{name}}/g, _.escape(data[i].name));
			template = template.replace(/{{middlePhotoUrl}}/g, data[i].middlePhotoUrl);
			template = template.replace(/{{provider}}/g, _.escape(data[i].provider));
			template = template.replace(/{{learnerCount}}/g, data[i].learnerCount);
			template = template.replace(/{{price}}/g, price);
			template = template.replace(/{{categoryName}}/g, _.escape(data[i].categoryName));
			template = template.replace(/{{description}}/g, _.escape(data[i].description));

			view = view + template;
		}

		return view;
	};

	//          Exports
  	// ----------------------------------------------------------------------
  	// 暴露API:  Amd || Commonjs  || Global 
  	// 支持commonjs
  	if (typeof exports === 'object') {
    	module.exports = Template;
    	// 支持amd
  	} else if (typeof define === 'function' && define.amd) {
    	define(function() {
    	  return Template;
    	});
 	} else {
 	   // 直接暴露到全局
 	   window.Template = Template;
  	}
})(util);
