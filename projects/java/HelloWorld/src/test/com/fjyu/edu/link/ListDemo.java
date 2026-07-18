package test.com.fjyu.edu.link;

import java.util.ArrayList;
import java.util.List;

public class ListDemo {
    public static void main(String[] args) {
        List<String> list = new ArrayList<>();   // 创建

        list.add("旺财");        // 末尾添加 → [旺财]
        list.add("小黑");
        list.add("旺财");        // List 允许重复 → [旺财, 小黑, 旺财]

        System.out.println(list.get(0));   // 取索引0 → 旺财
        System.out.println(list.size());   // 长度 → 3
        System.out.println(list.contains("小黑"));  // true

        list.set(1, "大黄");    // 改索引1 → [旺财, 大黄, 旺财]
        list.remove(0);         // 删索引0 → [大黄, 旺财]

        // 遍历:增强 for(对标 JS 的 for...of)
        for (String name : list) {
            System.out.println(name);
        }
    }
}