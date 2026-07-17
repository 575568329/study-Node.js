package test.com.fjyu.edu.animal;

public abstract class Animal {
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
    public abstract void eat();
}


