package test.com.fjyu.edu.animal;

public class Cat extends Animal{
    public Cat(String name, int age){
        super(name,age);
    }
    @Override
    public void eat(){
        System.out.println(getName()+"吃鱼");
    }
}
