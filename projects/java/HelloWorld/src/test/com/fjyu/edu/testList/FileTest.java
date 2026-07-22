package test.com.fjyu.edu.testList;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class FileTest {
    public static void main(String[] args) {
        // 读取所有行
        Path path1 = Paths.get("C:/Users/fjyu9/Desktop/test.txt");
        Path path = Paths.get("C:/Users/fjyu9/Desktop/output.txt");
        try {
            List<String> lines = Files.readAllLines(path1);
            System.out.println("读取文件");
            for (String line : lines) {
                System.out.println(line);
            }
            System.out.println("Stream方式");
            lines.forEach(System.out::println);
        }catch (IOException e){
            throw new RuntimeException(e);
        }
        // 写文件

        try {
            List<String> content = Arrays.asList("姓名,年龄","张三,25","李四,30");
            Files.write(path,content);
            System.out.println("写入完成");

            List<String> result = Files.readAllLines(path);
            System.out.println("文件内容");
            result.forEach(System.out::println);
        }catch (IOException e){
            throw new RuntimeException(e);
        }

        //追加内容
        try {
            List<String> appendContent= Collections.singletonList("王五,28");
            Files.write(path,appendContent, StandardOpenOption.APPEND);
            System.out.println("追加完成");

            List<String> afterAppend = Files.readAllLines(path);
            System.out.println("追加后的内容");
            afterAppend.forEach(System.out::println);
        }catch (IOException e){
            throw  new RuntimeException(e);
        }

        //大文件逐行读取
        System.out.println("逐行读取");
        try (BufferedReader reader = Files.newBufferedReader(path)){
            String line;
            while ((line = reader.readLine()) != null){
                if (line.contains("张")){
                    System.out.println("找到"+ line);
                }
            }
        }catch (IOException e){
            throw new RuntimeException(e);
        }

    }
}
