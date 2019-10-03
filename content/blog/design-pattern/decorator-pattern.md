---
title: "[DesignPattern] 데코레이터 패턴(Decorator Pattern)이란?"
date: 2019-09-09
category: 'Design Pattern'
---

데코레이터 패턴은 유연한 확장을 지원하는 패턴으로 무언가를 첨가해서 계속해서 장식(decoration)할 때 사용할 수 있는 패턴입니다  
원리는 간단합니다 재귀적인 방법으로 클래스를 덫 씌우면서 장식을 추가 합니다

![decorator_pattern](./images/decorator_pattern.png)

<span class="img_caption">출처 : [위키피디아](https://en.wikipedia.org/wiki/Decorator_pattern) </span>

---

## Decorator Pattern Sample Code
***카페에서 커피를 주문한다고 할때, 우유, 흑당등을 첨가하는 코드입니다***

<br/>

#### Caffee Code
```java

//커피 인터페이스 구현
public interface Coffee {
    /* highlight-range{1-2} */
    public double getCost(); //가격  
    public String getIngredients(); //추가된 재료  
}


//Interface 구현
public class SimpleCoffee implements Coffee {
    @Override
    public double getCost() {       
        return 1100;
    }

    @Override
    public String getIngredients() {  
        return "Americano";
    }
}
```

<br/>


#### Decorator Code
```java

public abstract class CoffeeDecorator implements Coffee {
    private final Coffee decoratedCoffee;

    public CoffeeDecorator(Coffee coffee) {
        this.decoratedCoffee = coffee;
    }

    @Override
    public double getCost() {
        return decoratedCoffee.getCost();
    }

    @Override
    public String getIngredients() {
        return decoratedCoffee.getIngredients();
    }
}

//CoffeeDecpratpr 상속
class Milk extends CoffeeDecorator {

    public WithMilk(Coffee coffee) {
        super(coffee);
    }

    @Override
    public double getCost() { // Overriding methods defined in the abstract superclass
        return super.getCost() + 300;
    }

    @Override
    public String getIngredients() {
        return super.getIngredients() + ", 우유";
    }
}

//CoffeeDecpratpr 상속
class BlackSugar extends CoffeeDecorator {

    public BlackSugar(Coffee coffee) {
        super(coffee);
    }

    @Override
    public double getCost() {
        return super.getCost() + 500;
    }

    @Override
    public String getIngredients() {
        return super.getIngredients() + ", 흑당";
    }
}

```

<br/>

#### Main Code
```java

public class Main {
    public static void main(String[] args) {
        Coffee coffee = new SimpleCoffee();      //기본 아메리카노
        System.out.println("가격 : "+coffee.getCost()+"원 / 메뉴 : "+coffee.getIngredients())

        coffee = new Milk(coffee);    //우유 추가
        System.out.println("가격 : "+coffee.getCost()+"원 / 메뉴 : "+coffee.getIngredients())

        coffee = new BlackSugar(coffee);   //흑당 추가
        System.out.println("가격 : "+coffee.getCost()+"원 / 메뉴 : "+coffee.getIngredients())
    }
}

```

<br/>


#### 실행화면
```java

가격 : 1100원 / 메뉴 : Americano
가격 : 1400원 / 메뉴 : Americano, 우유
가격 : 1900원 / 메뉴 : Americano, 우유, 흑당

```