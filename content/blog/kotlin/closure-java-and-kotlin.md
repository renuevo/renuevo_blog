---
title: "[Kotlin] java와 kotlin의 closure에 관하여"
date: 2019-09-22
category: 'Kotlin'
---
이전에 [왜 Kotlin을 써야 할까?](https://renuevo.github.io/why-kotlin)에서 제가 언급했던 closure에 관한 포스팅을 하려고 합니다  

##Closure
먼저 closure부터 살펴 보겠습니다  
<span class='red_font'>**Closure**</span>는 `close over`라는 의미로 일반적으로 언어마다 조금씩의 차이가 있을수 있겠지만 일반적으로 
내부 scope를 뛰어 넘어서 하위 함수가 상위 함수의 접근할 수 있는 것을 말합니다  
말로 하면 어려우니 java와 kotlin의 closure를 code로 보면서 이해하는게 쉬울꺼 같습니다   

---

##Kotlin Closure  
kotlin에서는 closure를 자유롭게 사용할 수 있습니다(javascript등의 언어들도 여기에 속합니다)  

<span class='code_header'>**Kotlin Closure Code 1**</span>  
```kotlin

    fun main(args: Array<String>) {
        var name = "kim deokhwa"
            fun closureTest(){
                println(name)   //close over 접근 /* highlight-line */  
            }
        closureTest()   //kim deokhwa 출력 /* highlight-line */  
    }

```
일단 내부함수에서 외부 변수에 접근해서 값을 출력하는 예시입니다  
내부의 closureTest에서 외부변수인 name을 접근해서 println으로 출력했습니다

<br/>

<span class='code_header'>**Kotlin Closure Code 2**</span>  
```kotlin

    fun main(args: Array<String>) {
        var name = "kim deokhwa"
            fun closureTest(){
                name = "renuevo"   //close over 접근 변경 /* highlight-line */  
            }
        closureTest()
        println(name)   //renuevo 출력 /* highlight-line */  
    }

```
이처럼 접근 또한 아니라 변경도 가능합니다  
하지만 java에서는 이러한 closure의 기능이 제한되며 오로지 `final`값을 참조하는 것만 가능합니다    
이러한 Closure는 익명함수와 내부함수들 또는 익명클래스들 보다 `lambda`를 사용할때 더욱 유용합니다  

<br/>

<span class='code_header'>**Kotlin Closure Code 3 <span class='sub_header'>(lambda & closure)</span>**</span>  
```kotlin
    public static void main(String[] args) {

        val personList = listOf("deokhwa Kim", "junghoon Im", "jikin Kim")
    
        var allName: String? = null
        /* highlight-range{1-4} */
        personList.forEach {
            allName = if (allName.isNullOrEmpty()) it   //외부 참조
                      else "$allName, $it"
        }
        println("person name : $allName") //person name : deokhwa Kim, junghoon Im, jikin Kim
    }
``` 
위의 예제는 allName에 모든 이름을 모아서 출력하는 예제입니다  
보스는것과 같이 allName에 personList의 labmda식 내부에서 얼마든지 값 변경이 가능합니다  

---

##Java Closure
다음으로 java의 closure를 살펴 보도록 하겠습니다  
java의 closure는 다른 언어들의 closure은 다르게 오로지 참조만이 가능합니다  
이 때문에 java의 closure를 closure로 인정할지 말지 아직도 이견이 많다고 합니다  

<span class='code_header'>**Java Closure Code 1 <span class='sub_header'>(Anonymous Class)</span>**</span>  
```java

    public class RenuevoApplication {
    
        public static void main(String[] args) {
    
            String name = "kim deokhwa";  //유사 final  /* highlight-line */  
    
            Thread thread = new Thread(){
                public void run(){
                    System.out.println(name);   //kim deokhwa 출력 /* highlight-line */  
                }
            };
            thread.start();
        }
    }

```
이처럼 익명클래스의 함수가 외부의 변수값을 참조하는데는 문제가 없습니다  
위의 name은 `final`을 쓰지는 않았지만 `run()`에서 사용하므로 컴파일러에서는 `name`을 `final`로 인식하여 이후에도 변경하지 못하게 합니다  

<br/>

<span class='code_header'>**Java Closure Code 2 <span class='sub_header'>(Anonymous Class Final change Error)</span>**</span>  
```java

    public class RenuevoApplication {
    
        public static void main(String[] args) {
    
            String name = "kim deokhwa";
    
            Thread thread = new Thread(){
                public void run(){
                    name = "renuevo";  //local variables referenced from an inner class must be final or effectively final /* highlight-line */  
                    System.out.println(name);   
                }
            };
            thread.start();
        }
    }

```
이처럼 java에서는 closure로 참조만 가능 할뿐 값을 변경하려고 하면 Error을 보게 됩니다  

---

##같은 JVM위에서 돌아가는데 왜 Java는 안되고 Kotlin은 가능한 것일까?
일단 기본적으로 Inner에서 Outer 변수에 접근하는것은 `Scope`적인 측면에서 `Memory Leak` 현상이 발생할 수 있습니다  
또한 누군 heap memory고 내부는 stack에서 관리하니 memory 구조도 다르게 되는 것이죠  

`java`에서는 익명클래스에서 외부 변수를 참조할때 외부 변수값을 생성자로 받아와서 `capture형식`으로 사용하게 됩니다  
그래서 memory leak현상이 생길 수도 있으며, 데이터의 변경이 불가능 하게 되는 것입니다   

`kotlin`에서 사용하는 lambda에서는 `static`으로 외부 변수값에 접근하도록 구현되어 있습니다  
때문에 memory leak현상도 예방하면 외부변수에 자유롭게 접근할 수 있는 것입니다  

**그렇다면 java의 lambda에서는 어째서 static으로 closure를 사용할 수 있도록 만들지 않았을까요?**  
"Effective Java"의 저자이며 Java 언어에 많은 영향을 미치는 인물인 [Joshua Bloch](https://en.wikipedia.org/wiki/Joshua_Bloch)는 2010년에 다음과 같은 의견을 밝혔습니다  
```textbox
이미 익명 클래스로 할 수 있는 일을 더 쉽게 하고, 불필요하게 장황해지지 않게 하는 것이 가장 중요하다고 생각합니다. 
람다 표현식에서 변하는(mutable) 변수에 접근해 값을 덮어 쓸 수 있는 것은 좋기도 하고 나쁘기도 한것이 아니라 더 나쁜 것이라고 봅니다.
```
***때문에 java는 이전 익명 클래스의 견해를 그대로 계승하여 lambda에서도 외부변수의 참조는 가능하지만 변경은 불가능 하도록 구현된 것입니다***


---

##관련 참고
[[Kotlin] 메모리릭 방지하기 | Kotlin, Lambda의 강력함](https://meetup.toast.com/posts/186)  
[람다가 이끌어 갈 모던 Java](https://d2.naver.com/helloworld/4911107)  
[[자바] 람다(lambda)가 이끌어 갈 모던 JAVA(2)](https://12bme.tistory.com/361)  