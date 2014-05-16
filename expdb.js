// ==UserScript==
// @name       EXpand PreDB.me
// @namespace  http://github.com/moshmage
// @version    0.1
// @description  expands the predb.me website appending a "new term" placeholder that allows for Shows to be saved localy incrementing the episode number automatically
// @match      http://predb.me/*
// @require    https://datejs.googlecode.com/files/date.js
// @copyright  Creative Commons Attribution 4.0 International License.
// ==/UserScript==

$(document).ready(function() {
	var target = {
			menu: $(".sidebar .block-body .term-list"),
			cssCopy: false,
			allShows:[],
			date: new Date()
		},
		newEle = {
			expdb: $("<li class='expdb tl-adult'></li>"),
			menu: $("<a href=# class='expdb-add' alt='New search term'></a><a href=# class='expdb-load' alt='Load local storage'></a><a href=# class='expdb-out' alt='Eject local storage'></a><ul class='tl-children'></ul>"),
			hoverMenu: $("<ul class='expdb-menu'><li><span class='expdb-sel-day'>day</span></li><li><span class='expdb-remove' style='cursor:pointer;color:#7F7F7F;'>remove</span></li></ul>")
		};

	newEle.expdb.append(newEle.menu);
	$("body").append(newEle.hoverMenu);
	target.menu.prepend(newEle.expdb);
	if (localStorage.expdb_shows) target.allShows = JSON.parse(localStorage.expdb_shows);
    
	$('.expdb-menu').css({"background-color":"#F5F5F5","border-color": "#FEFEFE #FAFAFA","border-image": "none","border-style": "solid","border-width": "1px","box-shadow": "1px 0 4px 0 rgba(0, 0, 0, 0.2)","border-left": "0 none","border-radius": "0 4px 4px 0","display": "none","margin-left": "1px","position": "absolute"});
	$('.expdb-add').css({"background":"url('http://i.imgur.com/MfIDJpm.png') no-repeat","width":"32px","height":"32px","display":"block","float":"left","margin-left":"12px"});
	$('.expdb-load').css({"background":"url('http://i.imgur.com/sRM4IZH.png') no-repeat","width":"32px","height":"32px","display":"block","float":"left","margin-left":"13px"});
	$('.expdb-out').css({"background":"url('http://i.imgur.com/IF9Lyqf.png') no-repeat","width":"32px","height":"32px","display":"block","margin-left":"100px"});

	var addShows = function() {
		if (target.allShows) {
			$.each(target.allShows, function(i,val) {
				var searchString = val[0]+" S"+val[1]+"E"+val[2],
					showName = val[0], showSeason = val[1], showEpi = val[2],
					dayToIncrement = val[3], lastIncremented = val[4];
				if (Date.today().getDayName() === dayToIncrement && target.date.getDate() > lastIncremented) {
					val[2] = parseInt(val[2],10)+1;
					if (val[2] < 10) val[2] = "0"+val[2];
					showEpi = val[2]; lastIncremented = target.date.getDate();
					searchString = val[0]+" S"+val[1]+"E"+val[2];
					target.allShows[i] = [showName,showSeason,showEpi,dayToIncrement,lastIncremented];
					console.log(target.allShows[i]);
					localStorage.expdb_shows = JSON.stringify(target.allShows);
				}
				$("<li class='tl-li tl-child' localIndex='"+i+"'><a href='?search="+searchString+"' class='expdb-show tl-expdb-term' >"+showName+"</a></li>").appendTo($(".expdb .tl-children"));
			});
		}

        $('.tl-expdb-term').css({"display": "list-item","padding": "3px 15px 5px 25px","padding-left": "40px","color": "#717171","background": "url('front/img/sprites.png') no-repeat","background-position": "22px -249px"});
        GM_addStyle(".tl-expdb-term:hover{background-color:#fdfdfd!important;}");
	GM_addStyle(".tl-expdb-term{-moz-transition: background-color .1s ease-out .01s;-webkit-transition: background-color .1s ease-out .01s;transition: background-color .1s ease-out .01s;}");
        $('.tl-expdb-term').css({"overflow": "hidden","text-overflow": "ellipsis","-o-text-overflow": "ellipsis","white-space": "nowrap","width": "100%"});
	};

	$(document).on('mouseenter','expdb-add',function() {
		$(this).parent().css("background-color","#FDFDFD");
	});
	$(document).on('mouseenter','expdb-add',function() {
		$(this).parent().css("background-color","transparent");
	});
	$(document).on('mouseenter','.expdb .tl-child',function() {
		var me = $(this),
			eleIndex = me.attr("localIndex"),
			eleInfo = target.allShows[eleIndex][3],
			eleTop = me.position().top + 97+"px";
		$('.expdb-menu .expdb-sel-day').text("@"+eleInfo+"s");
		$('.expdb-menu .expdb-remove').attr("localIndex",eleIndex);
		$('.expdb-menu').css({"display":"block","left":"200px","top":eleTop,"padding": "0 10px 5px"});

	});
	$(document).on('mouseleave','.expdb .tl-child',function() {
		$('.expdb-menu').css({"display":"none"});
	});
	$(document).on('mouseenter','.expdb-menu',function() {
		$(this).css({"display":"block"});
	});
	$(document).on('mouseleave','.expdb-menu',function() {
		$(this).css({"display":"none"});
	});

	$('.expdb-add').on('click', function() {
		var stringName = prompt("Enter show name","Your Fav Show");
		if (stringName) {
			var showSeason = prompt("Enter current season","01, 02, 03, etc.."),
				showEpisode = prompt("Enter current episode","01, 02, 03, etc.."),
				dayToIncrement = prompt("Enter day to increment episode number","Monday, Tuesday, etc.."),
				lastIncremented = target.date.getDate();
            target.allShows.push([stringName,showSeason,showEpisode,dayToIncrement,lastIncremented]);
            localStorage.expdb_shows = JSON.stringify(target.allShows);
            $(".expdb .tl-children").empty();
            addShows();
		}
	});

	$('.expdb-remove').on('click',function() {
		var localIndex = $(this).attr("localIndex");
		target.allShows.splice(localIndex,1);
		localStorage.expdb_shows = JSON.stringify(target.allShows);
		$(".expdb .tl-children").empty();
		addShows();
	});
    
    $('.expdb-load').on('click',function(){
        var loadLocal = prompt("Insert string here","");
        if (loadLocal) {
            localStorage.expdb_shows = loadLocal;
            target.allShows = JSON.parse(localStorage.expdb_shows);
            $(".expdb .tl-children").empty();
            addShows();
        }
    });
    
    $('.expdb-out').on('click',function(){
        if (localStorage.expdb_shows) {
        	var string = prompt("Copy the following line",localStorage.expdb_shows);
        }
        else {
        	window.alert("There are no saved search terms");
       	}
    });
	addShows();
});
