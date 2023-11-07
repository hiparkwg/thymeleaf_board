package kr.jobtc.board;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.stereotype.Component;

import kr.jobtc.mybatis.MybaFactory;

@Component
public class BoardDao {
	SqlSession session;
	Page page;

	public BoardDao() {
		session = MybaFactory.getFactory().openSession();
	}
	
	public String login(String id, String pwd) {
		MemberVo m = new MemberVo(id, pwd);
		String name = session.selectOne("board.login", m);
	
		return name;
	}

	public void hitUp(int sno){
		session.update("board.hitUpdate", sno);
		session.commit();
	}
	
	public String registerR(BoardVo vo) {
		String msg = "";
		int cnt = session.insert("board.registerR", vo);
		if(cnt>0) {
			session.commit();
		}else {
			session.rollback();
			msg = "저장중 오류 발생";
		}
		return msg;
	}
	
	public String modifyR(BoardVo vo) {
		String msg = "";
		int cnt = session.update("board.update", vo);
		if(cnt>0) {
			session.commit();
		}else {
			session.rollback();
			msg = "수정중 오류 발생";
		}
		return msg;
	}

	/* 댓글 여부르르체크하여 있으면 삭제 오류 */
	public String deleteR(BoardVo vo) {
		String msg = "";
		int cnt=0;
		try {
			/* 댓글 체크 */
			cnt = session.selectOne("board.checkRepl", vo.getSno());
			if(cnt>0) {
				throw new Exception("댓글이 존재합니다.");
			}
			
			cnt = session.delete("board.delete", vo.getSno());
			if(cnt>0) {
				session.commit();
			}else {
				msg = "삭제중 오류 발생";
			}
		}catch(Exception ex) {
			msg = ex.getMessage();
			session.rollback();
		}
		return msg;
	}
	
	
	
	public String registerRepl(ReplVo vo) {
		String msg = "";
		int cnt = session.insert("board.registerRepl", vo);
		if(cnt>0) {
			session.commit();
		}else {
			session.rollback();
			msg = "저장중 오류 발생";
		}
		return msg;
	}
	
	public BoardVo view(int sno) {
		BoardVo vo = null;
		vo = session.selectOne("board.view", sno);
				
		return vo;
	}
	

	public List<BoardVo> hitTop10(Page page){
		int totSize = session.selectOne("board.totSize", page);
		page.setTotSize(totSize);
		page.pageCompute();
		this.page = page;
		
		List<BoardVo> list = session.selectList("board.hitTop10", page);
		return list;
	}	

	
	public List<BoardVo> replTop10(Page page){
		int totSize = session.selectOne("board.totSize", page);
		page.setTotSize(totSize);
		page.pageCompute();
		this.page = page;

		List<BoardVo> list = session.selectList("board.replTop10", page);
		return list;
	}
	
	public List<BoardVo> newerTop10(Page page){
		int totSize = session.selectOne("board.totSize", page);
		page.setTotSize(totSize);
		page.pageCompute();
		this.page = page;

		List<BoardVo> list = session.selectList("board.newerTop10", page);
		return list;
	}	
	

	public List<BoardVo> replList(int sno){
		List<BoardVo> list = session.selectList("board.replList", sno);
		return list;
	}
	



	public String modifyReplR(ReplVo vo) {
		String msg = "";
		int cnt = session.update("board.updateRepl", vo);
		if(cnt>0) {
			session.commit();
		}else {
			session.rollback();
			msg = "댓글 수정중 오류 발생";
		}
		return msg;
	}
	
	public String delReplR(ReplVo vo) {
		String msg = "";
		int cnt = session.delete("board.delRepl", vo.getSno());
		if(cnt>0) {
			session.commit();
		}else {
			session.rollback();
			msg = "댓글 삭제중 오류 발생";
		}
		return msg;
	}	
	
	
	public Page getPage() {
		return this.page;
	}
	
}
