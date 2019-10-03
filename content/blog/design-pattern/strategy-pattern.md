---
title: "[DesignPattern] 전략 패턴(Strategy Pattern)이란?"
date: 2019-09-07
category: 'Design Pattern'
---
***메인 프로세스에서 상황에 맞게 전략을 선택하여 실행하는 패턴입니다***  

![strategy_pattern](./images/Strategy_Pattern.png)
<span class="img_caption">출처 : [위키피디아](https://ko.wikipedia.org/wiki/%EC%A0%84%EB%9E%B5_%ED%8C%A8%ED%84%B4) </span>

<br/>

이 패턴은 가장 기본적이며 인터페이스의 필요여부를 가장 잘 보여 주고 많은 곳에서 사용하고 있는 패턴입니다  
이 그림에서 볼 수 있듯이 하나의 인터페이스를 두고 클래스들이 인터페이스를 구현하여 사용됩니다  

---

## Strategy Sample

</br>

#### StrategyInterface
```java
public interface Strategy {
    public void execute();
}

```
<br/>

#### ContentsStrategyA &nbsp;<span calss="sub_header"></span>
```java
public class ContentsStrategyA implements Strategy{
    @Override
    public void execute() {
        System.out.println("앞으로 이동");
    }
}

```
<br/>

#### ContentsStrategyB &nbsp;<span calss="sub_header"></span>
```java
public class ContentsStrategyB implements Strategy{
    @Override
    public void execute() {
        System.out.println("뒤로 이동");
    }
}
```
<br/>

#### Main
```java

@SpringBootApplication
public class SimpleCode{

    //Run
    public void robot() {
    
        //전략 리스트
        List<String> moveList = Arrays.asList("go", "back", "go", "go");
        List<Strategy> strategyList = new ArrayList<>();

        moveList.forEach(m -> {
            switch (m) {
                case "go":
                    strategyList.add(new ContentsStrategyA());  //기능 A
                    break;
                case "back":
                    strategyList.add(new ContentsStrategyB());  //기능 B
                    break;
            }
        });

        strategyList.forEach(Strategy::execute);  //기능 실행
    }

}

```

<br/>

#### 실행결과
```
앞으로 이동
뒤로 이동
앞으로 이동
앞으로 이동

```

<br/>

위에 code를 보시면 먼저 **StrategyInterface** 인터페이스를 구현합니다  
그리고 각각의 기능을 **ContentsStrategyA**, **ContentsStrategyB**에서 구현하게 됩니다  
그러면 메인프로세스는 **StrategyInterface**만으로 각각의 상황에 맞춰 전략을 선택하고 실행 할 수 있습니다
