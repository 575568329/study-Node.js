package test.com.fjyu.edu.testList;

public class StringTest {
    public static void main(String[] args) {
        StringBuilder string = new StringBuilder();
        for (int i = 1;i<=10;i++){
            string.append(i);
            if (i<10){
                string.append(',');
            }
        }
        System.out.println(string.toString());

        String hello = "hello word java";
        String upHello = hello.toUpperCase();
        int len = upHello.length();
        System.out.println(upHello + len);

        String csv = "张三,25,,北京";
        String[] parts = csv.split(",");
        for (String part : parts) {
            if (part == null || part.trim().isEmpty()){
                System.out.println("(空)");
            }else{
                System.out.println(part);
            }
        }
    }
}