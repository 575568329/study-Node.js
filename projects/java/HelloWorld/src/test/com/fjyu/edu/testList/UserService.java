package test.com.fjyu.edu.testList;

import java.util.List;

public interface UserService {
    void add(String id,User user);

    User findByName(String name);

    User get(String id);

    void printAll();
}
