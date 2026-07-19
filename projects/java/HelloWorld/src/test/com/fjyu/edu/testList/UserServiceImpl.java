package test.com.fjyu.edu.testList;

import java.util.HashMap;
import java.util.Map;

public class UserServiceImpl implements UserService{
    private Map<String,User> userMap = new HashMap<>();
    @Override
    public void add(String id,User user){
        userMap.put(id, user);
    }

    @Override
    public User findByName(String name){
        for (Map.Entry<String, User> entry : userMap.entrySet()) {                 // 增强 for(对标 JS for...of),比索引 for 简洁
            if (entry.getValue().getName().equals(name)) {   // ✅ equals!
                return entry.getValue();                      // 找到立即返回,不浪费循环
            }
        }
        throw new UserNotFoundException("用户不存在：" + name);
    }

    @Override
    public User get(String id){
        return userMap.get(id);
    }

    @Override
    public void printAll(){
        for(Map.Entry<String, User> entry : userMap.entrySet()){
            System.out.println("name:"+entry.getValue().getName()+",age:"+entry.getValue().getAge() );
        }
    }
}
