/* sessionStorage에 저장하여 페이지의 현재 
 * 상태를 유지시키기 위한 리터널 */
let state = {
	'menu'     : 'home',  /* home, hit, repl, newer */
	'limitType': 'top10', /* top10 or all */
	'nowPage'  : 1,
	'findStr'  : null,
	'pos'      : 0,       /* 상세보기 및 댓글 목록 보기 위치 */
}

let oldMenu;
let oldPos;

/* state 값 설정 */
const setState = () => {
	let temp = JSON.stringify(state);
	sessionStorage.setItem('state', temp);
}

/* state 값 가져옴 */
const getState = () => {
	let temp = sessionStorage.getItem('state');
	if (temp != null) {
		state = JSON.parse(temp);
	}
}


/* 맨 처음, 새로고침한 경우 이전 메뉴 상태와 출력 목록 상태 유지 */
$( function(){
	getState();
	layoutSet();
	$('.findStr').val(state.findStr)
	switch(state.menu){
		case "home":
			funcHome();
			break;
		case "hit":
			funcHit();
			break;
		case "repl":
			funcRepl();
			break;
		case "newer":
			funcNewer();
			break;
		default :
			funcHome();
			break;
			
	}
})


/* 메뉴가 선택되었을 때 선택된 메뉴 상태를 저장 */
function menuSet(menu) {
	//sessionStorage.setItem('part', 'home');
	let menuClassName;
	switch(menu){
		case "home" : menuClassName = '.menuHome'; break;
		case "hit"  : menuClassName = '.menuHit'; break;
		case "repl" : menuClassName = '.menuRepl'; break;
		case "newer": menuClassName = '.menuNewer'; break;
	}

	/* 웹 페이지가 가장 처음 로딩된 경우가 아닌경우
	   만약 null 이라면 초기에 설정된 그대로 사용
	*/

	if (oldMenu != null) {
		$(oldMenu).css({
			'background-color' : '',
			'color' : '#000'
		})
	}

	$(menuClassName).css({
		'background-color' : '#000',
		'color' : '#fff'
	})

	state.menu = menu;
	oldMenu = menuClassName;
	setState();
}


const layoutSet = async () =>{
	let temp;
	$('.findZone').show();

	if(state.menu == 'home'){
		temp = await $.ajax({
			url : 'layout/home.html'
		})
		$('.section').html(temp)

	}else{
		temp = await $.ajax({url : 'layout/sub.html'});
		$('.section').html(temp)
	}

}

// 각 메뉴 버튼을 클릭했을 때 -----------------------
/* 홈버튼 처리 */
$('.menuHome').on('click', function(){
	$('.findStr').val(''); /*검색어 초기화*/
	state.findStr = '';
	state.nowPage = 1;
	state.pos = 0;
	state.menu = 'home';
	state.limitType= 'top10';
   setState();
	funcHome();
});

/* 
 funcHome()함수를 async 블럭으로 감싸준 이유는 layoutSet()함수가
 레이아웃을 설정해 주는 함수인데 레이아웃이 설정 되기 전에 아래쪽으로
 프로세스가 진행되는 것을 방지 하기 위함.
*/
async function funcHome(findStr){
	let temp; // top10 정보가 임시로 저장되는 변수
	menuSet(state.menu); // 메뉴 상태를 설정함.
	if(findStr != null){
		state.findStr = findStr;
		setState();
	}

	$('.findStr').val(state.findStr);

	let param = {
		'limitType' : state.limitType,
		'findStr'   : state.findStr,      
	}

	await layoutSet();
	

	/* state.menu 값을 변경하면 안됨 */
	param.menu = 'hit';
	$.ajax({
		url : '/top10',
		data : param,
		async : false,
		success : function(resp){
			$('.left').html(resp);
		}
	})



	param.menu = 'repl'
	$.ajax({
		url : '/top10',
		data : param, 
		async : false,
		success : function(resp){
			$('.center').html(resp);
		}
	})


	param.menu = 'newer'
	$.ajax({
		url : '/top10',
		data : param, 
		async : false,
		success : function(resp ){
			$('.right').html(resp);
		}
	})


}

/* 조회수 메뉴 */
$('.menuHit').on('click', function(){
	$('.findStr').val('');
	state.nowPage = 1;
	state.findStr = '';
	state.pos = 0;
	state.menu = 'hit';
	state.limitType = 'all';
	setState();
	funcHit();
}) 
async function funcHit(findStr) {
	menuSet(state.menu)
	if(findStr != null){
		state.findStr = findStr;
		setState();
	}

	await layoutSet();
	await boardList();
	replList();


}

/* 댓글 메뉴 */
$('.menuRepl').on('click', function(){
	$('.findStr').val('');
	state.nowPage = 1;
	state.findStr = '';
	state.pos = 0;
	state.menu = 'repl';
	state.limitType = 'all';
	funcRepl()
})
async function funcRepl(findStr) {
	menuSet(state.menu)
	if(findStr != null){
		state.findStr = findStr;
		setState();
	} 

	await layoutSet();
	await boardList();
	replList();

}

/* 새글순 메뉴 */
$('.menuNewer').on('click',function(){
	$('.findStr').val('');
	state.nowPage = 1;
	state.pos = 0;
	state.findStr = '';
	state.menu = 'newer';
	state.limitType = 'all';
	setState();
	funcNewer()
})
async function funcNewer(findStr) {
	menuSet(state.menu);
	if(findStr !=null){
		state.findStr = findStr;
		setState();
	}
	await layoutSet();
	await boardList();
	replList();

}


/* ----- 로그인 로그아웃 처리 ------------- */
const login = (ff) => {
	let param = {
		'id': ff.id.value,
		'pwd': ff.pwd.value
	}

	$.ajax({
		url: "/login",
		data: param,
		dataType: 'text',
		success: function(resp) {
			if (resp != '') {
				alert(resp);
			} else {
				location.href = "/";
			}
		}
	})
}

const logout = () => {
	$.ajax({
		url: "/logout",
		success: function(resp) {
			alert(resp)
			sessionStorage.removeItem("state")
			location.href = "/";
		}
	})
}

/* 더 보기 에서 클릭한 경우 */
const more = (menu)=>{
	let menuClassName;
	switch(menu){
		case "hit"  : menuClassName = '.menuHit'; break;
		case "repl" : menuClassName = '.menuRepl'; break;
		case "newer": menuClassName = '.menuNewer'; break;
	}

	$(menuClassName).click();
}


/* 검색 버튼이 클릭된 경우 */
const find = () => {
	let findStr = $('.findStr').val();
	state.findStr = findStr;
	state.nowPage = 1;
	state.pos=0;
	
	setState();
	
	/*
	switch(state.menu){
		case 'home':
			funcHome(findStr)
			break;
		case 'hit':
			funcHit(findStr);
			break;
		case 'repl':
			funcRepl(findStr);
			break;
		case 'newer':
			funcNewer(findStr);
			break;
	}
	*/
	setMenu();
}


const hitUp = async (sno)=>{
	
	await $.ajax({
		url : "/hitUp",
		data : { "sno" : sno}
	})
}

const go = async (pos, menu) => {
	let findStr = $('.findStr').val();
	state.pos = pos;
	state.menu = menu;
	state.limitType='all'
	state.findStr = findStr;		
	setState();
	
	menuSet(menu);
	layoutSet();
	
	
	/* 조회수 증가 */
	let tag = $('.row')[pos];
	let sno = $(tag).attr('sno')
	await hitUp(sno);

	await boardList();
	await replList(pos);
}

async function boardList(nowPage){
	let temp;
	if(nowPage != null){
		state.nowPage = nowPage
	}


	temp = await $.ajax({
		url : "/list", 
		data : state
	})
	$('.left').html(temp);
}


/* 패이지가 이동된 경우 */
const move = async (nowPage) => {
	state.nowPage = nowPage;
	setState();
	await boardList(nowPage)
	await replList(0);
}


function replList(pos){
	/* 새로고침을 하지 않은 경우엔 up=true */
	let up=false
	if(pos != null){
		up=true;
	}else{
		pos = state.pos;
	}

	state.pos = pos;
	setState();
	
	let tag = $('.row')[pos];
	let oldTag = $('.row')[oldPos];
	let sno = $(tag).attr('sno')
	
	if(up) hitUp(sno);
	
	
	let param={};
	param.sno = sno;
	$('.right').load("/replList",param);

	$(oldTag).attr('class', 'row');
	$(tag).attr('class', 'row tag');
	oldPos = pos;

}


