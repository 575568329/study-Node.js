package test.com.fjyu.edu.studyInterface;

import test.com.fjyu.edu.animal.Animal;
import test.com.fjyu.edu.animal.Dog;

public class AnimalServiceImpl implements AnimalService{
    @Override
    public void save(Animal animal) {
        System.out.println(animal.getName()+"保存成功");
    }

    @Override
    public Animal findById(String id) {
        return new Dog("旺财",3);
    }
}
