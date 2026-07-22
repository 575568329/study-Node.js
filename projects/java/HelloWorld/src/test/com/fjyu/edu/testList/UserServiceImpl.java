package test.com.fjyu.edu.testList;

import java.util.*;
import java.util.stream.Collectors;

public class UserServiceImpl implements UserService{
    private Map<String,User> userMap = new HashMap<>();
    @Override
    public void add(String id,User user){
        userMap.put(id, user);
    }

    @Override
    public User findByName(String name){
        return userMap.values().stream()                    // 只要 value（User）
                .filter(u -> u.getName().equals(name))          // 过滤名字匹配
                .findFirst()                                    // 找第一个
                .orElseThrow(() -> new UserNotFoundException("用户不存在：" + name));  // 没找到抛异常
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

    @Override
    public Map<Integer, List<User>> groupByAge() {
        return userMap.values().stream().collect(Collectors.groupingBy(User::getAge));
    }

    @Override
    public String findNameById(String id){
        return Optional.ofNullable(userMap.get(id)).map(User::getName).orElse("未知动物");
    }
}
