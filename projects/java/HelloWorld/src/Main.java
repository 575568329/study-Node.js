//TIP 要<b>运行</b>代码，请按 <shortcut actionId="Run"/> 或
// 点击装订区域中的 <icon src="AllIcons.Actions.Execute"/> 图标。
public class Main {
//    public static void main(String[] args) {
//        //TIP 当文本光标位于高亮显示的文本处时按 <shortcut actionId="ShowIntentionActions"/>
//        // 查看 IntelliJ IDEA 建议如何修正。
//        System.out.print("Hello and welcome!");
//
//        for (int i = 1; i <= 5; i++) {
//            //TIP 按 <shortcut actionId="Debug"/> 开始调试代码。我们已经设置了一个 <icon src="AllIcons.Debugger.Db_set_breakpoint"/> 断点
//            // 但您始终可以通过按 <shortcut actionId="ToggleLineBreakpoint"/> 添加更多断点。
//            System.out.println("i = " + i);
//        }
//    }
    public static void main(String[] args) {
       // 实验1： 整数类型
//        byte age = 25;
//        int population = 1400000000;
//        long distance = 9460730472580800L;
//        System.out.println("年龄：" + age);
//        System.out.println("人口：" + population);
//        System.out.println("距离：" + distance);
        // === 实验2：浮点数精度 ===
        System.out.println("\n=== 浮点数精度 ===");
        System.out.println("0.1 + 0.2 = " + (0.1 + 0.2));

        // === 实验3：char 的数值特性 ===
        System.out.println("\n=== char 类型 ===");
        char c1 = 'A';
        char c2 = 65;           // ASCII 码
        System.out.println("c1 = " + c1);
        System.out.println("c2 = " + c2);
        System.out.println("c1 == c2? " + (c1 == c2));
        System.out.println("c1 + 1 = " + (c1 + 1));  // 数值运算

        // === 实验4：类型转换 ===
        System.out.println("\n=== 类型转换 ===");
        int i = 100;
        long l = i;             // 自动转换
        System.out.println("int → long: " + l);

        double d = 9.99;
        int i2 = (int) d;       // 强制转换（丢失小数）
        System.out.println("double → int: " + i2);

        // === 实验5：final 常量 ===
        System.out.println("\n=== final 常量 ===");
        final double PI = 3.141592653589793;
        System.out.println("PI = " + PI);
        // PI = 3.14;           // 取消注释会编译错误
    }
}