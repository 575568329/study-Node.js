package test.com.fjyu.edu.animal;

//public class Dog {
//    private String name;
//    private int age;
//    public Dog(String name, int age){
//        this.name = name;
//        this.age = age;
//    }
//
//    public void bark(){
//        System.out.println("我是" + name);
//    }
//
//    public int getAge(){
//        return this.age;
//    }
//    public String getName(){
//        return this.name;
//    }
//
//    public void setAge(int age) {
//        if (age >= 0 && age <=30){
//            this.age = age;
//        }else{
//            System.out.println("年龄输入错误");
//        }
//    }
//}
public class Dog extends Animal{
    public Dog(String name, int age){
        super(name,age);
    }
    @Override
    public void eat(){
        System.out.println(getName()+"啃骨头");
    }
}

