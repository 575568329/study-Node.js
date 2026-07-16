package test.com.fjyu.edu.animal;

public class Bird extends Animal{
    public Bird(String name,int age){
        super(name,age);
    }
    public void fly(){
        System.out.println( getName()+ "正在飞");
    }
    @Override
    public void eat(){
        System.out.println( getName() + "啄米");
    }
}
