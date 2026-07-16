package test.com.fjyu.edu.animal;

public class Animal {
    private String name;
    private int age;
    public Animal(String name, int age){
        this.name = name;
        this.age = age;
    }
    public int getAge(){
        return this.age;
    }
    public String getName(){
        return this.name;
    }
    public void eat(){
        System.out.println(name + "在吃东西");
    }

}


