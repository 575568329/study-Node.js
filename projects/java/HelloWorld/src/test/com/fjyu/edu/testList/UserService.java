package test.com.fjyu.edu.testList;

import java.util.List;
import java.util.Map;

public interface UserService {
    void add(String id,User user);

    User findByName(String name);

    String findNameById(String id);

    User get(String id);

    void printAll();

    Map<Integer, List<User>> groupByAge();
}
