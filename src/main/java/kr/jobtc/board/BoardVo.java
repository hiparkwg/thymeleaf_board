package kr.jobtc.board;

import java.util.List;

import lombok.Data;

@Data
public class BoardVo {
	int sno, hit, pSno;
	int replCnt;

	String nal, id, subject, doc;
		
}
