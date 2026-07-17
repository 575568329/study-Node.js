package test.com.fjyu.edu.studyInterface;

import test.com.fjyu.edu.animal.Animal;
import test.com.fjyu.edu.animal.Dog;

public class Main {
    public static void main(String[] args) {
        AnimalService service = new AnimalServiceImpl();
        service.save(new Dog("旺财",3));
        Animal animal = service.findById("001");
        System.out.println(animal.getName());
    }
}
