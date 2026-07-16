package test.com.fjyu.edu.animal;

public class Zoo {
    public static void feedAll(Animal[] animals){
        if(animals != null && animals.length>0) {
            for (Animal animal : animals) {
                animal.eat();
            }
        }else{
            System.out.println("输入有误");
        }
    }
    public static void main(String[] args){
        Animal[] animals = {
                new Dog("小狗",10),
                new Bird("麻雀",10),
                new Cat("小猫",10),
        };

        feedAll(animals);
    }
}

