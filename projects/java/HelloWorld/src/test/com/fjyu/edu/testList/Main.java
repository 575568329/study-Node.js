package test.com.fjyu.edu.testList;

public class Main {
    public static void main(String[] args) {
        UserService userService = new UserServiceImpl();
        userService.add("001",new User("小狗", 10));
        userService.add("002",new User("小猫", 10));
        userService.add("003",new User("小鸟", 10));

        User findData = userService.findByName("小狗");
        if (findData!=null){
            System.out.println(findData.getName() + " " + findData.getAge());   // 小狗 10
        }

        userService.printAll();
    }
}