package kr.jobtc.board;

import lombok.Data;

@Data
public class MemberVo {
	String id;
	String pwd;
	String name;
	
	public MemberVo() {}
	public MemberVo(String id, String pwd) {
		this.id = id;
		this.pwd = pwd;
	}
	
	
}
