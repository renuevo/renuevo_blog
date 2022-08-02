---
title: "[DataStructure] HashMap, HashTable과 ConcurrentHashMap 대한 정리"
date: 2022-07-30
category: 'Data Structure'
---

***Map 인터페이스에 대한 내부구조 알아보기***  
약간의 사연이 있어서 😢  
편리하게 사용하고 있는 Map관련 내부구조를 다시 보고 정리하면서 확인해 보려고 합니다

<br/>

##HashMap (해시맵)

###Hash 알고리즘  
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
법그래서 별도의 **Separate Chaining(분리 연결법), Open Addressing(개방 주소)**
으로 [해시 충돌](https://renuevo.github.io/data-structure/map-interface/#hash-collision해시-충돌)을 예방합니다

<br/>
<br/>

###HashMap의 내부 구조

저장되는 데이터 구조를 살펴보겠습니다

```java

transient Node<K,V>[] table;
static final float DEFAULT_LOAD_FACTOR = 0.75f;
static final int TREEIFY_THRESHOLD = 8;

static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next;
    
    ......
    
}

//Red-Black Tree
static final class TreeNode<K,V> extends LinkedHashMap.Entry<K,V> {
    TreeNode<K,V> parent;  // red-black tree links
    TreeNode<K,V> left;
    TreeNode<K,V> right;
    TreeNode<K,V> prev;    // needed to unlink next upon deletion
    boolean red;
    TreeNode(int hash, K key, V val, Node<K,V> next) {
        super(hash, key, val, next);
    }
    
    ......
}

```

저장 데이터 단위는 Node로 구성되어 있습니다  
HashMap은 처음 생성될시에 기본적으로 16개의 Node를 저장할 수 있는 배열저장소를 내부에 생성합니다  
이걸 `Buckets`이라고 부릅니다

<br/>  

**HashMap의 내부 운영 방식**

1. **Buckets 사이즈 조절**  
   이전에 알아본 hash값을 기반으로 `(table.length - 1) & hash` buckets내의 자리를 찾고 그곳에 Node를 저장하게 됩니다  
   이후 16개의 DEFAULT\_LOAD\_FACTOR(75%)비율이 차게되면 buckets값을 2배 늘리고 값을 재분배하는 과정을 거칩니다

![hash buckets](./images/hash-bucket.png)
<span class='img_caption'>Source : [Hash Table Wiki](https://en.wikipedia.org/wiki/Hash_table) </span>

<br/>  

2. **Linked List**  
   Node를 보시면 `Node<K,V> next`를 보실 수 있습니다  
   key의 hash가 같은 Buckets 인덱스에 할당되면 key를 확인하고 다른 값이면 Linked List로 다음 Node로 해당 값을 저장합니다  
   이런 방식을 Separate Chaining(분리 연결법)이라고 합니다 👉 밑에서 자세히 살펴 보겠습니다

![hashmap buckets](./images/hashmap-bucket.png)
<span class='img_caption'>Source : [Hash Table Wiki](https://en.wikipedia.org/wiki/Hash_table) </span>

<br/>

3. **Red-Black Tree**  
   Linked List로 값을 저장하면 탐색 시간이 늘어나기 때문에 값이 늘어나면 효율적이지 않습니다  
   그래서 TREEIFY\_THRESHOLD(8)로 연결이 늘어나게 되면 Node를 `treeifyBin()`를 통해 TreeNode로 변경합니다  
   그리고 효율적인 레드블랙트리 알고리즘으로 저장합니다

👉 [Red-Black Tree (레드블랙 트리) Wiki](https://ko.wikipedia.org/wiki/%EB%A0%88%EB%93%9C-%EB%B8%94%EB%9E%99_%ED%8A%B8%EB%A6%AC)


<br/>

**다음으로 put의 코드를 살펴보겠습니다**

```java

final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
        Node<K,V>[] tab; Node<K,V> p; int n, i;
  (1)   if ((tab = table) == null || (n = tab.length) == 0) /* highlight-line */  
            n = (tab = resize()).length;
  (2)   if ((p = tab[i = (n - 1) & hash]) == null) /* highlight-line */  
            tab[i] = newNode(hash, key, value, null);
  (3)   else { /* highlight-line */  
            Node<K,V> e; K k;
             /* highlight-range{1-3} */ 
  (4)       if (p.hash == hash &&
                ((k = p.key) == key || (key != null && key.equals(k))))
                e = p;
            /* highlight-range{1-2} */ 
  (5)       else if (p instanceof TreeNode)
                e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);                
            /* highlight-range{1-2} */  
  (6)       else {
                for (int binCount = 0; ; ++binCount) {
                    if ((e = p.next) == null) {
                        p.next = newNode(hash, key, value, null);
                        /* highlight-range{1-2} */ 
  (7)                   if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                            treeifyBin(tab, hash);
                        break;
                    }
                    if (e.hash == hash &&
                        ((k = e.key) == key || (key != null && key.equals(k))))
                        break;
                    p = e;
                }
            }
            if (e != null) { // existing mapping for key
                V oldValue = e.value;
                if (!onlyIfAbsent || oldValue == null)
                    e.value = value;
                afterNodeAccess(e);
                return oldValue;
            }
        }
        ++modCount;
       /* highlight-range{1-2} */ 
 (8)    if (++size > threshold)
            resize();
        afterNodeInsertion(evict);
        return null;
    }

```  

생각보다 put의 소스 자체가 복잡해 보입니다  
여기서 주요 핵심부분을 8개로 나눠서 분류하고 하나씩 뜯어보겠습니다

<br/>

<span class='red_font'>(1)</span> `if ((tab = table) == null || (n = tab.length) == 0)`
> 처음 등장하는 조건문입니다  
> buckets이 null 이거나 사이즈가 0인지를 체크하여 resize()를 통해 저장소를 생성합니다

<br/>

<span class='red_font'>(2)</span> `if ((p = tab[i = (n - 1) & hash]) == null)`
> hash의 buckets내의 index를 계산하고 null일 경우 Node를 바로 저장하는 조건문입니다

<br/>

<span class='red_font'>(3)</span> `else`
> hash의 buckets내의 index를 계산하고 null이 아닌 Node가 이미 들어 있는 경우입니다  
> <span class='red_font'>(4), (5), (6)</span>을 통해 put을 진행합니다

<br/>

<span class='red_font'>(4)</span> ` if (p.hash == hash && ((k = p.key) == key || (key != null && key.equals(k))))`
> hash와 key의 값을 비교하여 같은 key의 value 변경인지를 확인합니다  
> 같은 key로 확인되면 단순히 Node의 value값을 변경합니다


<br/>

<span class='red_font'>(5)</span> `else if (p instanceof TreeNode)`
> TreeNode 여부를 확인하여 Tree구조로 put을 진행합니다

<br/>

<span class='red_font'>(6)</span> `else { for (int binCount = 0; ; ++binCount)`
> Node의 Linked List를 탐색하며 put을 진행합니다

<br/>

<span class='red_font'>(7)</span> `if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st`
> <span class='red_font'>(6)</span>의 탐색을 진행하며 binCount가 너무 늘어나 탐색이 느려지는 기준점 TREEIFY\_THRESHOLD(8)에  
> 도달하게 된다면 `treeifyBin(tab, hash);`를 통해서 Node를 TreeNode로 변경합니다

<br/>

<span class='red_font'>(8)</span> `if (++size > threshold)`
> 마지막으로 buckets의 Node사이즈를 확인하여 resize() 여부를 결정합니다

<br/>


이것으로 HashMap의 구조를 알아 봤습니다  
단순히 저장해서 가져다가 쓰기만 했었는데 생각보다 내부에서는 다양한 알고리즘이 반영된걸 알 수 있었습니다

<br/>

다음은 HashMap 이전에 존재했던 HashTable에 대해 알아보겠습니다

--- 

<br/>

##HashTable (해시테이블)  
다음으로 알아볼 것은 HashMap 이전에 사용된 HashTable 입니다  
그래서 기능적으로 많이 닮아 있으므로 다른 부분만을 빠르게 살펴 보겠습니다

**hash 알고리즘**  
hash 알고리즘은 기존 HashMap과 달리 보조 해시 없이 기본 hashCode()를 그대로 사용합니다

```java
int hash = key.hashCode();
```

<br/>

###HashTable의 내부 구조

저장되는 데이터 구조를 살펴보겠습니다

```java

private transient Entry<?,?>[] table;

public Hashtable() {this(11, 0.75f);}

private static class Entry<K,V> implements Map.Entry<K,V> {
     final int hash;
     final K key;
     V value;
     Entry<K,V> next;
     
     ...
}

```

저장 데이터 단위는 Entry로 구성되어 있습니다  
HashTable은 11개 사이즈의 `Buckets`을 생성합니다

<br/>  

**HashTable의 내부 운영 방식**

1. **Buckets 사이즈 조절**
   HashMap과 동일하게 전체의 75%가 차게되면 사이즈를 조정합니다  
   `int newCapacity = (oldCapacity << 1) + 1;` 쉬프트 연산을 통해 기존 사이즈의 두배 +1 의 값으로 재설정 됩니다

![hash buckets](./images/hash-bucket.png)
<span class='img_caption'>Source : [Hash Table Wiki](https://en.wikipedia.org/wiki/Hash_table) </span>

<br/>  

2. **Linked List**  
   Entry도 Node와 같이 Linked List구조로 `Entry<K,V> next`를 가지고 있는걸 보실 수 있습니다  
   HashMap과 동일하게 충돌방지로 Separate Chaining(분리 연결법)을 사용하는걸 알 수 있습니다

![hashmap buckets](./images/hashmap-bucket.png)
<span class='img_caption'>Source : [Hash Table Wiki](https://en.wikipedia.org/wiki/Hash_table) </span>

<br/>

HashTable은 Liked List의 사이즈의 대해서 효율성을 위해 Tree로 바꾼다거나 하는 로직은 찾아 볼 수 없습니다

<br/>
<br/>

**다음으로 put의 코드를 살펴보겠습니다**

```java

(1) public synchronized V put(K key, V value) { /* highlight-line */  
 
        // Make sure the value is not null
        /* highlight-range{1-3} */ 
(2)     if (value == null) {
            throw new NullPointerException();
        }
      
        // Makes sure the key is not already in the hashtable.
        Entry<?,?> tab[] = table;
(3)     int hash = key.hashCode();  /* highlight-line */  
        int index = (hash & 0x7FFFFFFF) % tab.length;
        @SuppressWarnings("unchecked")
        Entry<K,V> entry = (Entry<K,V>)tab[index];
        
(4)      /* highlight-range{1-2} */  
        for(; entry != null ; entry = entry.next) {
            if ((entry.hash == hash) && entry.key.equals(key)) {
                V old = entry.value;
                entry.value = value;
                return old;
            }
        }
      
(5)     addEntry(hash, key, value, index);  /* highlight-line */  
        return null;
}



private void addEntry(int hash, K key, V value, int index) {
        Entry<?,?> tab[] = table;
        
        /* highlight-range{1-3} */  
(6)     if (count >= threshold) {
            // Rehash the table if the threshold is exceeded
            rehash();
      
            tab = table;
            hash = key.hashCode();
            index = (hash & 0x7FFFFFFF) % tab.length;
        }
      
        // Creates the new entry.
        @SuppressWarnings("unchecked")
        Entry<K,V> e = (Entry<K,V>) tab[index];
        tab[index] = new Entry<>(hash, key, value, e);
        count++;
        modCount++;
}


```

HashMap과 다르게 간단한 put 구조를 가지고 있습니다  

<br/>

<span class='red_font'>(1)</span> `public synchronized V put(K key, V value)`
> synchronized를 통해 thread-safe하게 설계된걸 확인 할 수 있습니다  
> 이후 HashMap에서는 사용상에 thread-safe 구성이 효율적이지 않다고 삭제되었습니다  

<br/>

<span class='red_font'>(2)</span> ` if (value == null) { throw new NullPointerException(); }`
> HashMap과 다르게 value에 null을 허용하지 않습니다   

<br/>

<span class='red_font'>(3)</span> `int hash = key.hashCode();`
> key값도 보조해시 없이 그냥 hashCode()를 사용합니다  
> 때문제 key에서도 null이 허용되지 않습니다 (HashMap에서는 보조해시에서 null일 경우 0을 할당합니다)  

<br/>

<span class='red_font'>(4)</span> `for(; entry != null ; entry = entry.next) `
> Entry를 탐색하며 값변경만을 적용합니다  


<br/>

<span class='red_font'>(5)</span> `addEntry(hash, key, value, index);`
> addEntry를 통해 신규 Entry를 buckets에 삽입합니다  

<br/>

<span class='red_font'>(6)</span> `if (count >= threshold)`
> buckets의 Entry사이즈를 확인하여 rehash() 여부를 결정합니다  


<br/>

--- 

<br/>

##ConcurrentHashMap(병행해시맵)

<br/>

---

## Hash Collision(해시 충돌)

###Separate Chaining(분리 연결법)

###Open Addressing(개방 주소법)


---

## 마무리

HashTable의 충돌발생시 해결법을 알고 있느냐는 질문을 받았습니다  
그때 당시 Separate Chaining(분리 연결법)의 방법을 알고 있었지만,   
충돌자체를 thread-safe여부로 받아들여 HashTable은 충돌이 발생하지 않는 걸로 알고 있다고 답해버렸습니다 😭

이를 계기로 명확하게 구조를 보고 정리하는 시간을 갖게 되었습니다 👋

---  

## 관련 참고

[Hash table 위키](https://en.wikipedia.org/wiki/Hash_table)  
[네이버 D2 포스팅](https://d2.naver.com/helloworld/831311)   
[망나니개발자님 블로그](https://mangkyu.tistory.com/102)  
[겐지충프로그래머님 블로그](https://hongjw1938.tistory.com/17?category=884192)  