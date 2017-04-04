$(document).ready( function() {

	var ip;

	var boardSize = 80;
	var currentColour = "black";

	$(function() { //on load
		$.get("http://jsonip.com/", function(response) {
		    ip = response.ip;
		    loads(ip);
		}, "jsonp");
	});

	function printBoard(i_BoardSize) {
	    var maxRow = parseInt(i_BoardSize);
	    var maxCol = parseInt(i_BoardSize);
	    var num = 1;

	    var myTable = $('<table oncontextmenu="return false" class="photo"></table>').appendTo("#mainTable");
	    for (var row = maxRow - 1; row >= 0; row--) {
	        var myRow = $("<tr></tr>").appendTo(myTable);
	        for (var col = 0; col < maxCol; col++) {
	        	//var randomColor = Math.floor(Math.random()*16777215).toString(16);
	        	var thistd = $('<td data-col="' + col + '" data-row="' + row + '"></td>');//$('<td style="background: #' + randomColor + '">' + '</td>');
	        	$(thistd).click(function(e){     //function_td
	        		if (startTimer == false) {
						saves($(this), $(this).data('col')+1, $(this).data('row'), currentColour);
		    		} else {
		    			myFunction("wait " + timeLeft + "s");
		    		}
				});
	            myRow.append(thistd);
	            num++;
	        }
	    }
	}

	$(".tg th").click(function(e){     //function_td
		currentColour = $(this).css("background-color");
		$(".tg th").css("border-left", "");
		$(".tg th").css("border-right", "");
		$(".tg th").css("border-bottom", "");
		$(".tg td").css("border-left", "");
		$(".tg td").css("border-right", "");
		$(".tg td").css("border-top", "");
		$(this).css("border-left","1px solid");
		$(this).css("border-right","1px solid");
		$(this).css("border-bottom","1px solid");
	});

	$(".tg td").click(function(e){     //function_td
		currentColour = $(this).css("background-color");
		$(".tg th").css("border-left", "");
		$(".tg th").css("border-right", "");
		$(".tg th").css("border-bottom", "");
		$(".tg td").css("border-left", "");
		$(".tg td").css("border-right", "");
		$(".tg td").css("border-top", "");
		$(this).css("border-left","1px solid");
		$(this).css("border-right","1px solid");
		$(this).css("border-top","1px solid");
	});
/*
	$("button").click(function(e){
	    myFunction();
	});
*/

/*
	$("td").click(function(e){     //function_td
	  $(this).css("font-weight","bold");
	  e.stopPropagation();
	});
*/

	function saves(obj, col, row, colour) {
		$.ajax({
	        url: '/save',
	        // dataType: "jsonp",
	        data: {
	        	"colour": colour,
	        	"col": col,
	        	"row": row,
	        	"ip": ip
	        },
	        type: 'POST',
	        jsonpCallback: 'callback', // this is not relevant to the POST anymore
	        success: function (data) {
	            //console.log('Success: ');
	            var ret = data;
	            //console.log('Success2: ' + JSON.stringify(data));
	            if (ret.status == 0) {
					obj.css("background", currentColour);
					//console.log("added " + "(" + col + ", " + row + ")");
	            	myFunction("added " + "(" + col + ", " + row + ")");
		    		startTimer = true;
		    		timeLeft = (300 - Math.floor((new Date - start) / 1000));
	            } else if (ret.status == 1) {
	            	//console.log(ret.message);
	            	myFunction(ret.message);
	            }
	        },
	        error: function (xhr, status, error) {
	        	//console.log("error");
	            console.log('Error: ' + error.message);
	            myFunction('Error connecting to the server.');
	        },
	    });
	}
	function loads(ip) {
		$.ajax({
	        url: '/load',
	        // dataType: "jsonp",
	        data: {
	        	"ip": ip
	        },
	        type: 'POST',
	        jsonpCallback: 'callback', // this is not relevant to the POST anymore
	        success: function (data) {
	            //console.log('Success: ');
	            var ret = data;
	            //console.log('Success2: ' + JSON.stringify(data));
					var width = $("#mainTable").height();
					$("#mainTable").css("width", width);
					$("#mainTable").css("height", width);
		    		printBoard(boardSize);
	            	for (var i = 0; i < ret.board.length; i++) {
	            		//console.log(i +"loves " + ret.board[i].row + " " + ret.board[i].col + ret.board[i].colour + "\n" + '#mainTable table tr:nth-child(' + ret.board[i].row + ') td:nth-child('+ ret.board[i].col + ')');
	            		var colmOv = ret.board[i].col;
	            		$('#mainTable table tr:nth-child(' + (boardSize - ret.board[i].row) + ') td:nth-child('+ colmOv + ')').css('background-color', ret.board[i].colour);
	            	}
	            if (ret.status == 1) {
	            	$("#timer").text("time left: " + ret.time + "s");
	            	timeLeft = ret.time;
	            	startTimer = true;
	            }
	        },
	        error: function (xhr, status, error) {
	        	//console.log("error");
	            console.log('Error: ' + error.message);
	            myFunction('Error connecting to the server.');
	        },
	    });
	}

	var start = new Date;
	var timeLeft = 0;
	var startTimer = false;

	setInterval(function() {
		if (startTimer == true) {
			timeLeft--;
			if (timeLeft > 0) {
	    		$('#timer').text("time left: " + timeLeft + "s");
	    	} else {
	    		$('#timer').text("you can place a block");
	    		startTimer = false;
	    	}
	    } else {
	    	start = new Date;
	    }
	}, 1000);

	$("td").bind("click", function(){
	    //alert( $(this).text() );
	    // change style here
	    $(this).addClass("clicked");
	    myFunction();
	});
/*
	$('td').hover(
	    function() {
	        $(this).animate({ 'zoom': 1.2 }, 400);
	    },
	    function() {
	        $(this).animate({ 'zoom': 1 }, 400);
	    }
	);*/

 $('#mainTable')
    // tile mouse actions
    .on('mouseover', function(){
      $(this).children('.photo').css({'transform': 'scale('+ $(this).attr('data-scale') +')'});
    })
    .on('mouseout', function(){
      $(this).children('.photo').css({'transform': 'scale(1)'});
    })
    .on('mousemove', function(e){
      $(this).children('.photo').css({'transform-origin': ((e.pageX - $(this).offset().left) / $(this).width()) * 100 + '% ' + ((e.pageY - $(this).offset().top) / $(this).height()) * 100 +'%'});
    })
    // tiles set up
    .each(function(){
      $(this)
        // add a photo container
        //.append('<div class="photo"></div>')
        // some text just to show zoom level on current item in this example
        //.append('<div class="txt"><div class="x">'+ $(this).attr('data-scale') +'x</div>ZOOM ON<br>HOVER</div>')
        // set up a background image for each tile based on data-image attribute
        .children('.photo').css({'background-image': 'url('+ $(this).attr('data-image') +')'});
    })
/*
    function myFunction() {
	    // Get the snackbar DIV
	    $("snackbar").addClass("show");

	    // After 3 seconds, remove the show class from DIV
	    setTimeout(function(){ $("snackbar").removeClass("show"); }, 3000);
	}
*/

});

function myFunction(text) {
	if (text != null) {
	    // Get the snackbar DIV
	    var x = document.getElementById("snackbar")

	    x.innerHTML = text;

	    // Add the "show" class to DIV
	    x.className = "show";

	    // After 3 seconds, remove the show class from DIV
	    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
	}
}