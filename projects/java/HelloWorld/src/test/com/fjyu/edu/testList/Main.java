package test.com.fjyu.edu.testList;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.*;

public class Main {
    public static void main(String[] args) {
        UserService userService = new UserServiceImpl();
        userService.add("001",new User("小狗", 10));
        userService.add("002",new User("小猫", 6));
        userService.add("003",new User("小鸟", 9));
        List<User> users = new ArrayList<>();
        users.add(new User("小狗", 10));
        users.add(new User("小猫", 6));
        users.add(new User("小狗", 10));  // 重复
        users.add(new User("小鸟", 9));
        users.add(new User("小猫", 6));   // 重复

        System.out.println("\n=== Stream 基础操作 ===");
        System.out.println("过滤年龄>=18的用户：" + users.stream().filter(u->u.getAge()>=18).map(User::getName).collect(Collectors.toList()));

        System.out.println("\n=== 异常处理测试 ===");
        try {
            User findData = userService.findByName("不存在的狗");
            System.out.println(findData.getName());
        } catch (UserNotFoundException e){
            System.out.println("捕获到:" + e.getMessage());
        }
        User findData = userService.findByName("小狗");
        System.out.println("找到：" + findData.getName() + " " + findData.getAge());

        System.out.println("\n=== 打印所有用户 ===");
        userService.printAll();

        System.out.println("\n=== 按年龄分组 ===");

        userService.groupByAge().forEach((age, userList) -> {
            System.out.println("年龄" + age + "：" + userList);
        });

        System.out.println("\n=== findFirst 短路测试 ===");
        User result = users.stream()
                .filter(u -> {
                    System.out.println("检查：" + u.getName());
                    return u.getName().equals("大猫");
                })
                .findFirst()
                .orElse(null);

        System.out.println("\n=== Optional 测试 ===");
        System.out.println("查询不存在的ID：" + userService.findNameById("004"));

        System.out.println("\n=== 统计操作 ===");

        long count = users.stream().filter(u->u.getAge()>5).count();
        System.out.println("年龄>5的人数: " + count);
        int sum = users.stream().mapToInt(User::getAge).sum();
        System.out.println("年龄总和: " + sum);
        double avgAge = users.stream().mapToInt(User::getAge).average().orElse(0.0);
        System.out.println("平均年龄: " + avgAge);

        System.out.println("\n=== 排序测试 ===");
        System.out.println("按年龄升序：");
        List<User> sortedByAge = users.stream()
                .sorted(Comparator.comparing(User::getAge))
                .collect(Collectors.toList());
        sortedByAge.forEach(u-> System.out.println("  " + u.getName() + " - " + u.getAge()));

        System.out.println("\n按年龄降序：");
        List<User> reversedSorted = users.stream()
                .sorted(Comparator.comparing(User::getAge).reversed())
                .collect(Collectors.toList());
        reversedSorte.forEach(u-> System.out.println(u.getName() + " - " + u.getAge()));

        //按照年龄升序,年龄相同按照名字字典排序
        List<User> multiSorted = users.stream()
                .sorted(Comparator.comparing(User::getAge).thenComparing(User::getName))
                .collect(Collectors.toList());
        multiSorted.forEach(u-> System.out.println("  " + u.getName() + " - " + u.getAge()));

        System.out.println("\n=== 去重测试 ===");
        System.out.println("去重前数量：" + users.size());
        List<User> uniqueUsers = users.stream().distinct().collect(Collectors.toList());
        System.out.println("去重后数量：" + uniqueUsers.size());
        System.out.println("去重后用户：");
        uniqueUsers.forEach(u-> System.out.println("  " + u.getName()+ " - " + u.getAge()));

    }

}