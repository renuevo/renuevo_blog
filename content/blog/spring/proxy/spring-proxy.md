---
title: "[Spring] Spring Proxy의 JDK Dynamic Proxy와 CGLIB"  
date: 2022-08-12  
category: 'Spring'
---

***Proxy 살펴보기***  
일반적으로 스프링에서 말하는 기능적 프록시는 2가지 패턴의 기능 역할을 합니다  

1. **데코레이션 패턴 (Decorator Pattern)** 👉 [데코레이션 포스팅](https://renuevo.github.io/design-pattern/decorator-pattern/)  
> 부가적으로 기능을 부여한다  

2. **프록시 패턴 (Proxy Pattern)**  
> 접근에 대한 제어를 한다  


![proxy](./images/proxy.png)  

프록시는 `OCP(개방-폐쇄 원칙)`을 지키는 아주 좋은 수단입니다  
클라이언트가 서비스 호출시 프록시를 통해 실제 target(서비스구현체)을 호출하도록 만듭니다  
중간에서 프록시는 **부가기능 or 접근제어** 등의 역할을 수행합니다  

일반적으로 많이 사용하는 `@Transactional` 같은 애들이 이러한 프록시를 통해 구현되어 있으며  
이러한 트릭을 통해 개발자는 서비스 구현에만 더욱 집중할 수 있도록 만들어 줍니다  

<br/>
<br/>

**하지만 프록시는 <span class='red_font'>단점</span>도 가지고 있습니다**  

1. target(서비스)의 개수만큼 프록시가 생성되어야 한다  
2. 같은 기능의 경우 코드 중복이 일어난다  
3. 프록시를 사용하지 않는 메서드도 래핑처리되어 프록시를 통해 target에 도달한다  

이러한 단점들을 보완하기 위한 해결책이 다이나믹프록시입니다  
개발자가 프록시를 별도로 생성하는것이 아니라 런타임시 동적으로 가상 객체를 적용시킵니다  
이렇게 런타임시 동적으로 프록시 객체를 생성해서 적용하는 방식을 `런타임 위빙(Runtime Weaving)`이라고 합니다  


그럼 Spring AOP가 내부에서 동적으로 프록시를 생성할때 사용되는 JDK Dynamic Proxy와 CGLIB를 알아보겠습니다  

<br/>

---




<br/>

## 관련 참고

[Moon님 블로그](https://gmoon92.github.io/spring/aop/2019/04/20/jdk-dynamic-proxy-and-cglib.html)  
[keep going님 블로그](https://velog.io/@hanblueblue/Spring-Proxy-1-Java-Dynamic-Proxy-vs.-CGLIB)  
[JiwonDev님 블로그](https://jiwondev.tistory.com/151)
[로키님 블로그](https://yejun-the-developer.tistory.com/6)  