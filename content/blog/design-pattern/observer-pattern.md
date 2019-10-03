---
title: "[DesignPattern] 옵저버 패턴(Observer Pattern)이란?"
date: 2019-09-05
category: 'Design Pattern'
---

옵저버 패턴은 Java 내부와 Spring Core, Reative Programming의 기본이 되는 패턴입니다
옵저버 디자인 패턴은 기본적으로 `Subject`와 `Observer`를 가지고 있습니다  

> **1. Subject**
>> Observer의 Manager 개념으로 Observer를 등록하여 특정 이벤트가 발생했을때 관찰자들이 알 수 있도록 해준다  

> **2. Observer**
>> 실제 관찰자로 이벤트의 따른 기능들이 구현되어 있고, Subject에 등록되었다가 호출되어 진다  

기본적으로 Observer 인터페이스를 생성해 두고 Observer를 구현해서 Subject의 등록해서 사용합니다  
***한마디로, 여러 기능들을 하나의 인터페이스로 통합해서 Subject의 등록해서 호출하는 로직으로 볼 수 있습니다 <span class="sub_header">(1 대 N관계)</span>***  

<br/>


![observer_pattern](./images/Observer.png)

<span class="img_caption">출처 : [위키백과 옵서버 패턴](https://ko.wikipedia.org/wiki/%EC%98%B5%EC%84%9C%EB%B2%84_%ED%8C%A8%ED%84%B4)</a></span>


---

***이해를 돕기위해 Observer 부터 구현해 보겠습니다***

### Observer Sample
```java
    /* highlight-range{1-3} */
    public interface Observer<T> {       //옵저버 인터페이스
        void printEvent(T event);
    }

    public class ObserverEventA implements Observer<String> { 
        @Override
        public void printEvent(String event) {
            System.out.println("Event : " + event);  //옵저버 기능
        }
    }
    
```

<br/>

### Subject Sample
```java

    public interface Subject<T> {
        void registerObserver(Observer<T> observer); //옵저버 등록

        void removeObserver(Observer<T> observer);   //옵저버 삭제

        void executeObserver(T event);               //옵저버 실행
    }


    public class SampleSubject implements Subject<String> {

        private final Set<Observer<String>> observerSet = new CopyOnWriteArraySet<>();    //Thread Safe Set

        public void registerObserver(Observer<String> observer) {
            this.observerSet.add(observer);
        }

        public void removeObserver(Observer<String> observer) {
            this.observerSet.remove(observer);
        }

        public void executeObserver(String event) {
            this.observerSet.forEach(o -> o.printEvent(event));
        }
    }

```

<br/>

### Observer Run
```java

    @Test
    public void observerTest(){

        Subject<String> subject = new SampleSubject();      //observer manager 생성
        
        subject.registerObserver(new ObserverEventA());     //observer 등록
 
        subject.registerObserver(event -> {                 //lambda식 등록도 가능합니다
            System.out.println("Event : " + event);
        });         
        
        subject.registerObserver(System.out::println);      //lambda 단순 println

        subject.executeObserver("Observer Run");            //실행
    }

```

<br/>

> **실행 결과**
```

Event : Observer Run
Event : Observer Run
Observer Run

```

---
## 마무리  
Java에서도 JDK1.0에서 Observer와 Observable이 릴리즈되어 사용할 수 있습니다  
하지만 자바 제네릭이 없던 시절이라.. Object타입을 사용해서 안전성이 보장되지 않습니다
그래서 인지 **JDK9 버젼** 부터는 **Deprecated** 되었습니다

<br/>

더 나아가 Observer 구현해서 사용 하시기전 다음과 같은 사항을 권고하고 있습니다  

>**1. 이벤트 모델**
>> Java.beans 패키지 사용으로 구성  

>**2. 쓰레드간 메시징**
>>java.util.concurrent 패키지에서 동시 데이터 조작 구조를 사용  

>**3. Reactive Programing**
>> Flow API를 참조하여 구현

자세한 관련 내용은 [Java's Observer and Observable Are Deprecated in JDK 9](https://dzone.com/articles/javas-observer-and-observable-are-deprecated-in-jd)를 참고 하세요