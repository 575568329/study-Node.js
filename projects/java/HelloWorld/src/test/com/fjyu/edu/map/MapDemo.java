package test.com.fjyu.edu.collection;

import test.com.fjyu.edu.testList.User;
import java.util.HashMap;
import java.util.Map;

public class MapDemo {
    public static void main(String[] args) {
        // <key类型, value类型> —— 你 Q2 学的泛型,这里用上了
        Map<String, User> userMap = new HashMap<>();

        userMap.put("001", new User("旺财", 3));      // 放
        userMap.put("002", new User("小黑", 5));
        userMap.put("001", new User("大黄", 8));      // key 重复 = 覆盖(对标 JS obj.k 重新赋值)

        System.out.println(userMap.get("001").getName());   // 大黄(被覆盖了)
        System.out.println(userMap.containsKey("002"));      // true
        System.out.println(userMap.size());                  // 2

        User notFound = userMap.get("999");    // key 不存在 → 返回 null(不是 undefined!)
        // notFound.getName();   // 💥 如果直接调,空指针!要先判空

        if (notFound != null) {                 // ✅ Java 没有 ?. 可选链,只能手动判空
            System.out.println(notFound.getName());
        } else {
            System.out.println("没找到");
        }

        userMap.remove("002");                  // 删

        // 遍历(对标 JS 的 for (const [k, v] of map))
        for (Map.Entry<String, User> entry : userMap.entrySet()) {
            System.out.println(entry.getKey() + " => " + entry.getValue().getName());
        }
    }
}