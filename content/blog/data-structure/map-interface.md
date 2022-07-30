---
title: "[DataStructure] HashMap, HashTable과 ConcurrentHashMap 대한 정리"
date: 2022-07-30
category: 'Data Structure'
---

***Map 인터페이스에 대한 내부구조 알아보기***  
약간의 사연이 있어서 😢  
편리하게 사용하고 있는 Map관련 내부구조를 다시 보고 정리하면서 확인해 보려고 합니다

<br/>

##Hash 알고리즘
먼저 key를 저장하는 hash와 관련된 내용부터 살펴 보겠습니다  
```java


//String.java의 JDK11 기준 -> jdk8부터는 큰 차이가 없습니다  
public int hashCode() {
    int h = hash;
    if (h == 0 && value.length > 0) {
        hash = h = isLatin1() ? StringLatin1.hashCode(value)
                              : StringUTF16.hashCode(value);
    }
    return h;
}

//Lation1
public static int hashCode(byte[] value) {
    int h = 0;
    for (byte v : value) {
        h = 31 * h + (v & 0xff);
    }
    return h;
}

//UTF16
public static int hashCode(byte[] value) {
    int h = 0;
    int length = value.length >> 1;
    for (int i = 0; i < length; i++) {
        h = 31 * h + getChar(value, i);
    }
    return h;
}


//해시 보조
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}

```

기본적으로 key의 hashCode() 값을 기반으로 보조 해시함수로 비트연산자를 활용하여 계산합니다

<br/>

hashCode()의 경우 char를 돌면서 31을 곱하면서 계산합니다  
짝수를 곱할 경우 내부연산에서 곱을 왼쪽으로 이동하는 쉬프트 연산으로 계산하면서  
overflow가 되고 0만 가득차게 될 수 있기 때문에 홀수와 소수인 31을 관행적으로 사용한다고 합니다  

<br/>

보조해시 함수를 `test`를 예를 들어 설명하겠습니다
> 1. test의 hashCode()는 3556498이고 bit값은 `1101100100010010010010`입니다
> 2. bit연산으로 (h >>> 16)으로 앞의 6자리만을 남깁니다 `110110`
> 3. 1번과 2번의 값을 xor 연산하여 3556516을 도출합니다 `1101100100010010100100`

보는 것과 같이 hash 함수가 엄청 간단합니다

<br/>

이렇게 간단하게 구현된 해시값이 겹치지 않을까요!? 👉 **물론 겹칠 수 있습니다**  
이전에는 보다 복잡한 보조해시를 썼지만 hashCode() 자체의 알고리즘 개선과 효율성 측면에서 간단하게 계산합니다  
그래서 별도의 **Separate Chaining(분리 연결법), Open Addressing(개방 주소법)**으로 [해시 충돌](https://renuevo.github.io/data-structure/map-interface/#hash-collision해시-충돌)을 예방합니다  

<br/>


##Map 자료구조  


###HashMap (해시맵)  


<br/>

--- 

###HashTable (해시테이블)  

<br/>

--- 

###ConcurrentHashMap(병행해시맵)  

<br/>

## Hash Collision(해시 충돌)

###Separate Chaining(분리 연결법)

###Open Addressing(개방 주소법)


---
## 마무리  
HashTable의 충돌발생시 해결법을 알고 있느냐는 질문을 받았습니다  
그때 당시 Separate Chaining(분리 연결법)의 방법을 알고 있었지만,   
충돌자체를 thread-safe여부로 받아들여 HashTable은 충돌이 발생하지 않는 걸로 알고 있다고 답해버렸습니다 😭  

이를 계기로 명확하게 구조를 보고 정리하는 시간을 갖게 되었습니다  

---  

## 관련 참고
[네이버 D2 포스팅](https://d2.naver.com/helloworld/831311)   
[망나니개발자님 블로그](https://mangkyu.tistory.com/102)  