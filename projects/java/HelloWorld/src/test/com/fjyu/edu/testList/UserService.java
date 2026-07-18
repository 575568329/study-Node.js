package test.com.fjyu.edu.testList;

public interface UserService {
    void add(String id,User user);

    User findByName(String name);

    User get(String id);

    void printAll();
}
