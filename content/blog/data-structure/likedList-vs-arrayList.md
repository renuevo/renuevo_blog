---
title: "[DataStructure] ArrayList는 왜 LinkedList 보다 빠를까?"
date: 2019-09-15
category: 'Data Structure'
---
***LinkedList와 ArrayList 내부구조 알아보기***


###LinkedList  
먼저 `LinkedList`부터 알아보겠습니다  
LinkedList는 Array가 사이즈를 지정해서 생성해야하는 한계점을 극복하기 위해 고안되었습니다  
각각의 Node가 다음값을 참조하게 해서 계속해서 값을 이어나갈수 있는 구조를 가지고 있습니다  

![LinkedList](./images/LinkedList.png)  
<span class="img_caption">Linked List 구조</span>

**LinkedList Java Code <span class='sub_header'>(Node)</span>**
```java
    private static class Node<E> {
        E item;         /* highlight-line */
        Node<E> next;   /* highlight-line */
        Node<E> prev;  

        Node(Node<E> prev, E element, Node<E> next) {
            this.item = element;
            this.next = next;
            this.prev = prev;
        }
    }
```

<br/>

C언어에서는 포인트 참조로 노드를 이어나가고 Java 위의 코드와 같이 객체로 다음 값을 이어나가고 있습니다  
하지만 LinkedList는 속도 측면에서 큰 문제를 가지고 있습니다  
`6번째 인덱스`에 값을 가져올때 `1~6까지 순서대로 참조`를 따라가서 값을 가져와야 하므로 시간복잡도에서 많은 비효율을 가지고 있어서 
현재는 `LikedList`보다 개선된 `ArrayList`를 많이 사용하게 되었습니다


---

###ArrayList  
다음은 ArrayList입니다  
ArrayList는 내부의 배열을 사용하여 Array의 이점을 가져오는 것과 동시에 내부의 일정크기 이상의 값이 들어오면 Array를 새로할당하여 LikedList처럼 메모리가 되는한에서 무한히 확장할 수 있도록 설계 되었습니다   

원리는 간단합니다  
> 1. 내부의 elementData 배열을 선언합니다  
> 2. 값이 들어오면 배열의 size에 빈공간이 있는지 확인합니다  
> 3. 빈공간이 있을 경우 마지막에 값을 추가합니다  
> 4. 빈공간이 없을 경우 `(size + (size >> 1))`만큼 새로운 배열을 생성합니다  
> 5. 새로운 배열을 생성했을 경우 원래 배열의 값을 복사한후 마지막에 값을 추가합니다  

**ArrayList Java Code <span class='sub_header'>(point)</span>**
```java

    private void add(E e, Object[] elementData, int s) {
        /* highlight-range{1-2} */
        if (s == elementData.length) //배열 마지막이면
            elementData = grow();    //배열 사이즈 증가
        elementData[s] = e;
        size = s + 1;
    }

    //새로운 배열 생성  
    private Object[] grow(int minCapacity) {
        return elementData = Arrays.copyOf(elementData, newCapacity(minCapacity));  /* highlight-line */
    }

    //새로운 내부 배열 사이즈 설정 
    private int newCapacity(int minCapacity) {
        // overflow-conscious code
        int oldCapacity = elementData.length;
        int newCapacity = oldCapacity + (oldCapacity >> 1);  /* highlight-line */
        ......
    }
    
```

<br/>

---

## 마무리
LinkedList와 ArrayList의 내부구조를 알아 봤습니다  
다음은 각 자료구조에 따른 시간복잡도 입니다

![arraylist-vs-linkedlist-complexity](./images/arraylist-vs-linkedlist-complexity.png)
<span class='img_caption'>source [arraylist-vs-linkedlist-vs](https://dzone.com/articles/arraylist-vs-linkedlist-vs)<span>

Java를 토대로 ArrayList가 LinkedList보다 좋은지에 대해서 간단히 알아본 것이므로 각각의 언어와 내부 설계에 따라 위에 구현이 다를 수 있습니다  
중요한것은 자료구조의 이론이므로 그것만 알아 두었으면 합니다  