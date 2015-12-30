;
(function() {
	'use strict';
	
	// 用于存放事项
	var list = [];

	// 每一项的结构
	var tempObj = {
		"text": "这里是待办事项名字",
		"isDone": false,
		"id":"_todo_123124214"
	};

	// 输入框
	var todo_input = $('#todo-input');

	// 全选按钮
	var select_all = $('#select-all');

	// 列表容器
	var todo_list = $('#todo-list');

	// 剩餘未完成
	var left_count = $('#left-count');

	// 全選
	var select_all = $('#select-all');

	// 顯示全部
	var btn_show_all = $('#btn-show-all');

	// 顯示active
	var btn_show_active = $('#btn-show-active');

	// 顯示已完成的
	var btn_show_completed = $('#btn-show-completed');

	var btn_delete_completed = $('#btn-delete-completed');
	
	todo_input.on('keydown', function(e) {
		e= e || window.event;
		var keyCode = e.keyCode || e.which;
		if (keyCode === 13) {

			var input_text = $(this).val().trim();
			if (!input_text.length) {
				return;
			}
			todo_list.show();
			addItem(input_text);
			countLeftItem();
			// 清空
			$(this).val('');
		};
	});

	todo_list.on('click','.close', function(e) {
		var _id=$(this).data("id");
		deleteItem(_id);
		countLeftItem();
		if (list.length===0) {
			todo_list.hide();
		};
	});

	todo_list.on('change','input',function(e) {
		var $this = $(this);
		var _id = $this.data('id');

		// 是否是 每个项的状态都是已完成 ?
		var _flag = true;

		list.forEach(function(e,i,arr) {
			if (e.id === _id) {
				e.isDone = $this.is(':checked')?true:false;
			};
			if (e.isDone===false) {
				_flag=false;
			};
		});

		if (_flag) {
			select_all.prop('checked',true);
		} else {
			select_all.prop('checked',false);
		}
		countLeftItem();
	});

	select_all.on('change',function(e) {
		var $this=$(this);
		var _input=todo_list.find('input');
		if (!_input) {
			return ;
		};
		if ($this.is(':checked')) {
			seletcAll();
			countLeftItem();
			_input.prop('checked',true);
		}else{
			cancleSelectAll();
			countLeftItem();
			_input.prop('checked',false);
		}
		
	})

	btn_show_all.on('click',function(e){
		showAll();
	});

	btn_show_active.on('click',function(e){
		showActive();
	});

	btn_show_completed.on('click',function(e){
		showCompleted();
	});

	btn_delete_completed.on('click',function(e){
		deleteSelected();
		if (list.length===0) {
			todo_list.hide();
			select_all.prop('checked',false);
		};
	})
	function addItem(text) {
		if (!text) {
			return;
		}
		var item = $.extend({}, tempObj);
		item.text = text;
		item.id='_todo_'+new Date().getTime();
		list.push(item);

		var li='<li id="'+item.id+'">'
                    +'<a href="#">'
                    	+'<label>'
	                        +'<input data-id="'+item.id+'" type="checkbox" />'
	                        +'<span>'+item.text+'</span>'
	                        +'<button type="button btn-danger" class="close" data-id="'+item.id+'"><span>&times;</span></button>'
                    	+'</label>'
                    +'</a>'
                +'</li>';
         todo_list.prepend(li);       
	}


	function deleteItem(id){
		$('#'+id).remove();
		list.forEach(function(el,i,arr){
			if (el.id===id) {
				arr.splice(i,1);
			};
		});
	}

	function countLeftItem(){
		var _count=list.length;
		list.forEach(function(el,i,arr){
			if (el.isDone===true) {
				_count--;
			}
		});
		left_count.find('span').text(_count);
		return _count;
	}

	function seletcAll(){
		list.forEach(function(el,i,arr) {
			el.isDone=true;
		});
	}
	function cancleSelectAll(){
		list.forEach(function(el,i,arr) {
			el.isDone=false;
		});
	}

	function showAll(){
		todo_list.find('li').show();
	}
	function showActive(){
		list.forEach(function(e,i,arr) {
			if (e.isDone===true) {
				$('#'+e.id).hide();
			}else{
				$('#'+e.id).show();
			}
		})
	}
	function showCompleted(){
		list.forEach(function(e,i,arr) {
			if (e.isDone===true) {
				$('#'+e.id).show();
			}else{
				$('#'+e.id).hide();
			}
		})
	}

	function deleteSelected(){
		list=list.filter(function(el,i,arr){
			if (el.isDone===true) {
				$('#'+el.id).remove();
			};
			return el.isDone!==true;
		});
	}
})();