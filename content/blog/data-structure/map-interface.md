---
title: "[DataStructure] HashMap, HashTable과 ConcurrentHashMap 대한 정리"
date: 2022-07-30
category: 'Data Structure'
---

알고 있는 내용이라고 하더라도 용어 차이 때문에 제대로 이해하지 못하는 경우가 많은 것 같습니다 🥲  
그래서 Map관련 내부구조를 다시 보고 정리하면서 확인해 보려고 합니다

<br/>

***Map 인터페이스에 대한 내부구조 알아보기***

###Hash 알고리즘  

```java

static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}

```
기본적으로 key의 hashCode() 값의 비트연산자를 활용하여 계산합니다  



###HashMap (해시맵)



---  

## 관련 참고
[네이버 D2 포스팅](https://d2.naver.com/helloworld/831311)  