package kr.jobtc.mybatis;

import java.io.Reader;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class MybaFactory {
   private static SqlSessionFactory factory;
   static{
      try{
         Reader r = Resources.getResourceAsReader("kr/jobtc/mybatis/config.xml");
         factory = new SqlSessionFactoryBuilder().build(r);
      }catch(Exception ex){
         ex.printStackTrace();
      }
   }
   public static SqlSessionFactory getFactory() {
      return factory;
   }
   
}
