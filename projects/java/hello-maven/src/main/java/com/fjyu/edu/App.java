package com.fjyu.edu;
import org.apache.commons.lang3.StringUtils;

public class App {
    public static void main(String[] args) {
        String s1 = null;
        String s2 = "";
        String s3 = "   ";
        String s4 = "hello";

        System.out.println("null isBlank: " + StringUtils.isBlank(s1));      // true
        System.out.println("\"\" isBlank: " + StringUtils.isBlank(s2));      // true
        System.out.println("\"   \" isBlank: " + StringUtils.isBlank(s3));   // true
        System.out.println("\"hello\" isBlank: " + StringUtils.isBlank(s4)); // false

        // Day 8 学的：isBlank vs isEmpty
        System.out.println("\"   \" isEmpty: " + StringUtils.isEmpty(s3));   // false（空格算有内容）
    }
}