package kr.jobtc.board;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpSession;

@RestController
public class BoardController {

	@Autowired
	BoardDao boardDao;

	@RequestMapping("/")
	public ModelAndView index() {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("index");
		return mv;
	}


	@RequestMapping("/login")
	public String login(HttpSession session, String id, String pwd) {
		String msg = "";
		String name = boardDao.login(id, pwd);

		if (name != null) {
			session.setAttribute("name", name);
			session.setAttribute("id", id);
		} else {
			msg = "로그인 정보를 확인해 주세요";
		}
		return msg;
	}

	@RequestMapping("/logout")
	public String logout(HttpSession session) {
		String msg = "로그아웃 되었습니다.";
		session.invalidate(); /* 세션의 모든값 제거 */
		return msg;
	}

	@RequestMapping("/register")
	public ModelAndView register() {
		ModelAndView mv = new ModelAndView();
		mv.setViewName("board/register");
		return mv;
	}

	@RequestMapping("/registerR")
	public String registerR(BoardVo vo) {
		String msg = "";
		msg = boardDao.registerR(vo);

		return msg;
	}

	@RequestMapping("/registerRepl")
	public String registerRepl(ReplVo vo) {
		String msg = "";
		msg = boardDao.registerRepl(vo);

		return msg;
	}

	@RequestMapping("/modifyR")
	public String modifyR(BoardVo vo) {
		String msg = "";
		msg = boardDao.modifyR(vo);

		return msg;
	}

	@RequestMapping("/deleteR")
	public String deleteRR(BoardVo vo) {
		String msg = "";
		msg = boardDao.deleteR(vo);

		return msg;
	}

	@RequestMapping("/hitUp")
	public void hitUp(int sno){
		boardDao.hitUp(sno);
	}

	/* Home 메뉴 버튼이 클릭되었을 때 */
	@RequestMapping("/top10")
	public ModelAndView top10(Page page, String menu) {
		ModelAndView mv = new ModelAndView();
		List<BoardVo> list = null;

		/* 메뉴(조회, 댓글, 최신)에 따라 분기 */

		switch (menu) {


			case "hit":
				list = boardDao.hitTop10(page);
				mv.addObject("subTitle", "조회 top10");
				mv.addObject("top10List", list);
				mv.addObject("menu", menu);
				mv.setViewName("board/top_10");
				break;

			case "repl":
				list = boardDao.replTop10(page);
				mv.addObject("subTitle", "댓글 top10");
				mv.addObject("top10List", list);
				mv.addObject("menu", menu);
				mv.setViewName("board/top_10");
				break;

			case "newer":
				list = boardDao.newerTop10(page);
				mv.addObject("subTitle", "최신 top10");
				mv.addObject("top10List", list);
				mv.addObject("menu", menu);
				mv.setViewName("board/top_10");
				break;
		}

		return mv;
	}

	

	@RequestMapping("/list")
	public ModelAndView list(String menu,  Page page) {

		ModelAndView mv = new ModelAndView();
		List<BoardVo> list = null;

		switch(menu){
			case "hit":
				list = boardDao.hitTop10(page);
				break;
			case "repl":
				list = boardDao.replTop10(page);
				break;
			case "newer":
				list = boardDao.newerTop10(page);
				break;
		}
		
		mv.addObject("page", boardDao.getPage());
		mv.addObject("list", list);

		mv.setViewName("board/list");
		return mv;
	}

	@RequestMapping("/replList")
	public ModelAndView replList(int sno) {
		ModelAndView mv = new ModelAndView();
		List<BoardVo> list = boardDao.replList(sno);
		BoardVo vo = boardDao.view(sno);

		mv.addObject("sno", sno);
		mv.addObject("vo", vo);
		mv.addObject("list", list);
		mv.setViewName("board/repl_list");
		return mv;
	}

	@RequestMapping("/modifyReplR")
	public String modifyReplR(ReplVo vo) {
		String msg = "";
		msg = boardDao.modifyReplR(vo);

		return msg;
	}

	@RequestMapping("/delReplR")
	public String delReplR(ReplVo vo) {
		String msg = "";
		msg = boardDao.delReplR(vo);

		return msg;
	}

}
