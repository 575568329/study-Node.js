package test.com.fjyu.edu.testList;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;

public class DateTest {
    public static void main(String[] args) {
        LocalDate today = LocalDate.now();
        LocalDate tomorrow = today.plusDays(1); //明天
        LocalDate yesterday = today.minusDays(1); //昨天
        LocalDate nextWeek = today.plusWeeks(1); //下周

        // 加减月
        LocalDate nextMonth = today.plusMonths(1); // 下个月
        LocalDate lastMonth = today.minusMonths(1); //上个月

        //加减年
        LocalDate nextYear = today.plusYears(1);

        System.out.println(today); // 原对象不变
        System.out.println(tomorrow); // 新对象

        LocalDate date1 = LocalDate.of(2024, 1, 15);
        LocalDate date2 = LocalDate.of(2024, 7, 20);
        date1.isBefore(date2); // 再date2之前
        date1.isAfter(date2); //在date2之后
        date1.isEqual(date2); // 与date2相等

        date1.compareTo(date2);

        //计算日期间隔
        LocalDate start = LocalDate.of(2024, 1, 1);
        LocalDate end = LocalDate.of(2024, 7, 20);

        //方式1:用 Period(年月日分开)
        Period period = Period.between(start, end);
        System.out.println(period.getYears());
        System.out.println(period.getMonths());
        System.out.println(period.getDays());

        long days = ChronoUnit.DAYS.between(start,end);
        System.out.println(days);

        LocalDate date = LocalDate.of(2024, 7, 20);

        int year = date.getYear();
        int month = date.getMonthValue();
        int day = date.getDayOfMonth();

        DayOfWeek dayOfWeek = date.getDayOfWeek();
        System.out.println(dayOfWeek);

        System.out.println(today);
        LocalDate birthday = LocalDate.of(1997, 7, 30);
        int age = calculateAge(birthday);
        System.out.println("年龄:" + age);

        //日期格式化(公司高频,重点)
        LocalDate date3 = LocalDate.of(2024,7,20);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // 格式化: 日期->字符串
        String text = date3.format(formatter);
        System.out.println(text);

        // 其他格式
        DateTimeFormatter cn = DateTimeFormatter.ofPattern("yyyy年MM月dd日");
        System.out.println(date3.format(cn));

        // 解析:字符串->日期
        String input = "2024-07-20";
        DateTimeFormatter formatter2 = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate date4 = LocalDate.parse(input, formatter2);
        System.out.println(date4);

        //解析今日格式化
        LocalDateTime time = LocalDateTime.now();
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("yyyy年MM月dd日 HH:mm");
        System.out.println(time.format(timeFormatter));

        String timeString = "2026-07-21";
        DateTimeFormatter timeFormatter2 = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate date5 = LocalDate.parse(timeString,timeFormatter2);
        //计算时间
        long date6 = ChronoUnit.DAYS.between(date5,LocalDate.now());
        System.out.println(date6);
    }
    public static int calculateAge(LocalDate birthday){
        LocalDate today = LocalDate.now();
        Period period = Period.between(birthday,today);
        return period.getYears();
    }
}
