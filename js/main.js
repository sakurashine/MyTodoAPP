//数据存储到一个浏览器刷新后不会丢失的地方
//比如localStorage
//这里用了一个插件store.js，有一些更方便的api
//store.set('key','value') store.get('key') store.clear('key')

;(function(){

	var taskList = [];
	init();

	var $addTask = $('.addTask')
	$addTask.on('submit',function(e){
		e.preventDefault();
		addTask();
		
	});

	// var $deleteBtn = $('.fr.delete');
	
	//点击删除按钮弹确认窗
	$('.taskList').on('click','.fr.delete',function(e){
		itemNum = e.target.parentNode.getAttribute('id').slice(4,5);
		pop();
	});

	//点击详情按钮显示任务详情窗口
	$('.taskList').on('click','.fr.desc',function(e){
		itemNum = e.target.parentNode.getAttribute('id').slice(4,5);
		var $top = $('#item' + itemNum).offset().top;
		var $left = $('#item' + itemNum).offset().left;
		var $width = $('#item' + itemNum).width();
		showTaskInfo($top, $left, $width);
	});

	var $sure = $('#sure');
	var $not = $('#not');
	$sure.on('click',function(){
			// console.log(taskList[itemNum]);
			taskList.splice(itemNum, 1);
			store.set('taskList', taskList);
			renderTaskList();
			pip();
	});
	$not.on('click',function(){
			pip();
			return false;
	});

	$(window).on('resize',function(){
		adjustBoxPosition();
		adjustTaskInfo();
	});
	function addTask(){
		var newTask = {}
		newTask.content = $('input[type=text]').val();
		newTask.desc = newTask.content + '的详情';
		taskList.push(newTask);
		store.set('taskList', taskList);
		console.log(store.get('taskList'));
		renderTaskList();
	}

	function getTaskItem(data, i){
		var taskItem = '<div class="taskItem" id="item' + i + '">' +
					'<input type="radio" />' +
					'<span>' + data.content + '</span>' +
					'<span class="fr desc">详情</span>' +
					'<span class="fr delete">删除</span>' +
					'</div>';
		return taskItem;
	}

	function renderTaskList(){
		var $taskList = $('.taskList');
		$taskList.html('');
		var i = 0;
		var length = taskList.length;
		for(i; i<length; i++){
			var taskItem = getTaskItem(taskList[i], i);
			$taskList.append(taskItem);
		}
	}

	function pop(){
		$('.mask').css("display","block");
		$('.box').css("display","block");
		adjustBoxPosition();
	}

	function pip(){
		$('.mask').css("display","none");
		$('.box').css("display","none");
	}

	function adjustBoxPosition(){
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();
		var boxWidth = $('.box').width();
		var boxHeight = $('.box').height();
		moveX = (windowWidth - boxWidth) /2 ;
		moveY = (windowHeight - boxHeight) /2 - 25;
		$('.box').css({
			left: moveX,
			top: moveY
		});
	}

	function init(){
		//全局
		taskList = store.get('taskList');
		if(taskList){
			renderTaskList();
		}else{
			return
		}
		
	}

	function showTaskInfo($top,$left,$width){
		if($top < 250){
			$('.taskInfo').css({
				top: $top + 41,
				left: $left + $width - 210,
				display: "block"
			});
		}else{
			$('.taskInfo').css({
				top: $top - 220,
				left: $left + $width - 210,
				display: "block"
			});
		}
	}

	function adjustTaskInfo(){
		var curLeft = $('.taskList').offset().left;
		var curWidth = $('.taskList').width();
		$('.taskInfo').css({
				left: curLeft + curWidth - 230,
			});
	}

	//点击空白区域隐藏任务详情
	$(document).mouseup(function(e){
	  var _con = $('.taskInfo');   // 设置目标区域
	  if(!_con.is(e.target) && _con.has(e.target).length === 0){
	    $('.taskInfo').css("display","none");
  }
});

})()