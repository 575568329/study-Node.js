package test.com.fjyu.edu.testList;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        UserService userService = new UserServiceImpl();
        userService.add("001",new User("小狗", 10));
        userService.add("002",new User("小猫", 10));
        userService.add("003",new User("小鸟", 10));
        List<User> users = new ArrayList<>();
        users.add(new User("大狗",18));
        users.add(new User("大猫",8));
        users.add(new User("大鸟",8));

        System.out.println(users.stream().filter(u->u.getAge()>=18).map(User::getName).collect(Collectors.toList()));
        try {
            User findData = userService.findByName("不存在的狗");
            System.out.println(findData.getName());
        } catch (UserNotFoundException e){
            System.out.println("捕获到:" + e.getMessage());
        }
        User findData = userService.findByName("小狗");
        System.out.println(findData.getName() + " " + findData.getAge());   // 小狗 10

        userService.printAll();

        userService.groupByAge().forEach((age, userList) -> {
            System.out.println("年龄" + age + "：" + userList);
        });


        User result = users.stream()
                .filter(u -> {
                    System.out.println("检查：" + u.getName());
                    return u.getName().equals("大猫");
                })
                .findFirst()
                .orElse(null);
        // Optional
        System.out.println(userService.findNameById("004"));
    }

}