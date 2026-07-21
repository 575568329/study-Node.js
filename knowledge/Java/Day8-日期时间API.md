# Day 8 学习记录

**日期**：2026-07-21
**主题**：Java 8 日期时间 API（LocalDate / LocalDateTime）

---

## 今日学习内容

### 1. 为什么 Java 有两套日期 API

| 旧 API（Java 1.0）| 新 API（Java 8）| 问题/改进 |
|------------------|----------------|----------|
| `java.util.Date` | `java.time.LocalDate` | 旧的可变、月份0开头、API混乱 |
| `java.util.Calendar` | `java.time.LocalDateTime` | 新的不可变、月份1-12、职责清晰 |

**旧 API 的致命问题**：
1. **可变**（多线程不安全，setTime 直接改原对象）
2. **月份从 0 开始**（反人类，year 还要减 1900）
3. **API 混乱**（Calendar.get 用魔法常量）
4. **时区处理困难**

**新 API 的核心设计**：不可变 + 职责分离
- `LocalDate`：只有日期（年月日）
- `LocalDateTime`：日期 + 时间
- `Instant`：UTC 时间戳（对标 JS Date.now()）
- `ZonedDateTime`：带时区

---

### 2. 创建日期

```java
LocalDate today = LocalDate.now();              // 当前日期
LocalDate date = LocalDate.of(2024, 7, 20);     // 指定日期（月份 1-12！）
LocalDateTime now = LocalDateTime.now();        // 当前日期+时间
```

---

### 3. 日期计算（不可变，返回新对象）

```java
LocalDate today = LocalDate.now();
LocalDate tomorrow = today.plusDays(1);      // 明天
LocalDate yesterday = today.minusDays(1);    // 昨天
LocalDate nextWeek = today.plusWeeks(1);     // 下周
LocalDate nextMonth = today.plusMonths(1);   // 下月
LocalDate nextYear = today.plusYears(1);     // 明年

// today 永远不变（不可变），每次操作返回新对象
```

**不可变的好处**：线程安全、可作 Map key、传参不怕被改（同 String 不可变）。

---

### 4. 日期比较

```java
date1.isBefore(date2);    // date1 在 date2 之前？
date1.isAfter(date2);     // 之后？
date1.isEqual(date2);     // 相等？
date1.compareTo(date2);   // < 0 / 0 / > 0

// ⚠️ 注意：调用有返回值的方法要接收/使用，否则这行没意义
boolean before = date1.isBefore(date2);   // 接收
if (date1.isBefore(date2)) { }            // 或直接判断
```

---

### 5. 计算日期间隔

```java
import java.time.Period;
import java.time.temporal.ChronoUnit;

LocalDate start = LocalDate.of(2024, 1, 1);
LocalDate end = LocalDate.of(2024, 7, 20);

// 方式1：Period（年月日分开）
Period period = Period.between(start, end);
period.getYears();    // 0 年
period.getMonths();   // 6 个月
period.getDays();     // 19 天（⚠️ 只是月份之外的天数，不是总天数）

// 方式2：ChronoUnit（总天数）⭐ 更常用
long days = ChronoUnit.DAYS.between(start, end);   // 201 天（总数）
```

**Period 的坑**：`getDays()` 不是总天数。要总天数用 `ChronoUnit.DAYS.between`。

---

### 6. 获取日期部分

```java
LocalDate date = LocalDate.of(2024, 7, 20);
date.getYear();          // 2024
date.getMonthValue();    // 7（⚠️ 1-12，不是 0-11！）
date.getDayOfMonth();    // 20
date.getDayOfWeek();     // SATURDAY（DayOfWeek 枚举）
```

---

### 7. 日期格式化（公司高频）

```java
import java.time.format.DateTimeFormatter;

// 日期 → 字符串
LocalDate date = LocalDate.of(2024, 7, 20);
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
String text = date.format(formatter);         // "2024-07-20"

// 字符串 → 日期
String input = "2024-07-20";
LocalDate parsed = LocalDate.parse(input, formatter);
```

**格式符号速查**：

| 符号 | 含义 | 示例 |
|------|------|------|
| `yyyy` | 年 | 2024 |
| `MM` | 月（补0）| 07 |
| `dd` | 日（补0）| 20 |
| `HH` | 时（24小时）| 14 |
| `mm` | 分 | 30 |
| `ss` | 秒 | 45 |

**⚠️ 大小写陷阱**：
- `MM` = 月，`mm` = 分
- `HH` = 24小时制，`hh` = 12小时制

---

### 8. 计算年龄（实战）

```java
public static int calculateAge(LocalDate birthday) {
    LocalDate today = LocalDate.now();
    Period period = Period.between(birthday, today);
    return period.getYears();   // 周岁
}
```

**为什么用 Period.getYears() 而不是天数/365**：
Period 精确处理闰年和月份，天数/365 会有误差。

---

## 对比 JS

| 操作 | JS | Java |
|------|-----|------|
| 当前时间 | `new Date()` | `LocalDate.now()` |
| 月份 | 0-11（坑）| 1-12 |
| 可变性 | 可变（setDate 改原对象）| 不可变（返回新对象）|
| 格式化 | 原生弱，用 dayjs | 内置 DateTimeFormatter |
| 加减日期 | 手动算毫秒 | plusDays/minusMonths |

**核心差异**：
- JS Date 可变 + 月份 0-11 + 格式化弱（依赖第三方库）
- Java 8 新 API 不可变 + 月份 1-12 + 内置格式化

---

## 公司代码印证

```java
// ZtfProcessServiceImpl.java
private LocalDateTime removeMinutesAndSecond(Long timestamp) {
    return DateUtil.millisToLocalDateTime(timestamp)
        .withMinute(0)       // 设分钟为0（返回新对象）
        .withSecond(0);      // 设秒为0（链式，不可变）
}

// ProcessProgressServiceImpl.java
buildCalculatorParams(params, LocalDateTime.now());   // LocalDateTime.now()
```

**印证**：
- 公司用 Java 8 新 API（LocalDateTime），不用旧 Date
- `.withMinute(0).withSecond(0)` 链式 + 不可变
- 新方法 `withXxx`：设置某字段，返回新对象

---

## 关键概念总结

1. **用新 API**：LocalDate/LocalDateTime，不用旧 Date/Calendar
2. **不可变**：所有操作返回新对象（plusDays/withMinute）
3. **月份 1-12**：不是 JS/旧 API 的 0-11
4. **间隔计算**：Period（年月日）/ ChronoUnit（总天数）
5. **格式化**：DateTimeFormatter，注意 MM（月）vs mm（分）

---

## 明天计划
- 字符串操作（String 不可变、StringBuilder、split/substring/replace）
- 文件 I/O（Files/Path）
