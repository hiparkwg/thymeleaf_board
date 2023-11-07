/**
 * 게시판 스크립트 
 */

// 이전에 선택되었던 목록

/* -------- 게시물 등록 ----------------- */
$('.btnRegister').on('click', function() {
	/*	
	$('.section').css({
		'grid-template-columns': '1fr',
		'padding': '30px'
	})
	*/

   $('.findZone').hide();
	$(".section").load("/register");
})

const setMenu = ()=>{
   switch(state.menu){
      case 'home':
         funcHome()
         break;
      case 'hit':
         funcHit();
         break;
      case 'repl':
         funcRepl();
         break;
      case 'newer':
         funcNewer();
         break;

   }
}

const registerR = (ff) => {
	let frm = $(ff).serialize();
   let findStr=state.findStr;
	$.ajax({
		url: '/registerR',
		data: frm,
		dataType: 'text',
		success: function(resp) {
			if (resp != '') {
				alert(resp)
			}

			setMenu();
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

		}
	})
}



const modify = (ff) => {
   let yn = confirm('정말 수정 하시겠습니까?');
	if (!yn) return;

	let frm = $(ff).serialize();
	$.ajax({
		url: '/modifyR',
		data: frm,
		dataType: 'text',
		success: function(resp) {
			if (resp != '') {
				alert(resp)
			}

			setMenu();

		}
	})
}

/* 댓글 존재 여부를 따져 없으면 삭제하고 있으면 오류 메시지 표시 */
const del = (ff) => {
	let yn = confirm('정말 삭제 하시겠습니까?');
	if (!yn) return;

	let frm = $(ff).serialize();
	$.ajax({
		url: '/deleteR',
		data: frm,
		dataType: 'text',
		success: function(resp) {
			if (resp != '') {
				alert(resp)
			}

			setMenu();

		}
	})
}

const registerRepl = (ff) => {
	let frm = $(ff).serialize();
	let sno = ff.pSno.value;
	$.ajax({
		url: '/registerRepl',
		data: frm,
		dataType: 'text',
		success: function(resp) {
			if (resp != '') {
				alert(resp)
			}
			let param = {
				'sno': sno,
			}
			$('.right').load("/replList", param);

		}
	})

}

/*
const view = (sno, pos) => {
	let tag;
	if(gState.menu != 'home'){
		if(sno==null || pos == null){
			sno = gState.sno;
			pos = gState.pos;
		}else{
			gState.pos = pos;
			gState.sno = sno;
			setGState();
		}
		
	}
	tag = $('.row')[pos];
	sno = $(tag).sno;

	$('.row').attr('class', 'row');
	$(tag).attr('class', 'row tag');
	
	
	
	if (oldTag != null) {
		$(oldTag).attr('class', 'row');
	}
	oldTag = tag;


	let param = {
		'sno': gState.sno,
	}
	$('.right').load("/replList", param);
}
*/

const modifyReplR = (ff) => {
   let yn = confirm('정말 수정 하시겠습니까?');
	if (!yn) return;

	let frm = $(ff).serialize();
	let sno = document.frmRegisterRepl.pSno.value;
	$.ajax({
		url: '/modifyReplR',
		data: frm,
		dataType: 'text',
		success: function(resp) {
			if (resp != '') {
				alert(resp)
			}
			let param = {
				'sno': sno,
			}
			$('.right').load("/replList", param);

		}
	})
}

const delReplR = (ff) => {
   let yn = confirm('정말 삭제 하시겠습니까?');
	if (!yn) return;

	let frm = $(ff).serialize();
	let sno = document.frmRegisterRepl.pSno.value;

	$.ajax({
		url: '/delReplR',
		data: frm,
		dataType: 'text',
		success: function(resp) {
			if (resp != '') {
				alert(resp)
			}
			let param = {
				'sno': sno,
			}
			$('.right').load("/replList", param);

		}
	})

}

