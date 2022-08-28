---
title: "[Spring] Spring의 프록시 생성 (ProxyBeanFactory)"  
date: 2022-08-12  
category: 'Spring'  
---

## Spring AOP에서 사용하는 Proxy  

**스프링에서 사용하는 프록시에 대해 알아볼 시간입니다**

총 3편으로 나누어서 구성하였습니다  

1. [Spring Proxy의 JDK Dynamic Proxy와 CGLIB](https://renuevo.github.io/spring/proxy/spring-proxy)  
> a. [Proxy 살펴보기](https://renuevo.github.io/spring/proxy/spring-proxy/#proxy-살펴보기)    
> b. [JDK Dynamic Proxy](https://renuevo.github.io/spring/proxy/spring-proxy/#jdk-dynamic-proxy)   
> c. [CGLIB](https://renuevo.github.io/spring/proxy/spring-proxy/#cglib)  
2. [Spring의 프록시 생성 (ProxyBeanFactory)]() :construction: 작성중  
3. [Spring Proxy의 빈 후처리기(BeanPostProcessor)]() :construction: 작성중  


## Proxy Factory 살펴보기  

이전 포스팅에서 프록시를 직접생성해서 관리할때의 문제점을 마지막으로 살펴보았습니다  
1. 프록시가 중첩되면 코드가 복잡해진다  
2. target별로 프록시를 생성하는 코드 및 관리 포인트가 증가한다  
3. 사용하지 않는 메서드도 프록시에 구현해서 서빙해야 한다  
4. 같은 기능의 프록시 기능이 target별로 중복될 수 있다  

이러한 문제를 해결하기 위해 스프링에서는 `Proxy Factory`를 통해 프록시를 생성합니다  

<br/>

![proxy factory](./images/proxy-factory.png)  
<span class='img_caption'>Proxy Factory</span>

프록시 팩토리(Proxy Factory)는 스프링의 동적 프록시를 통합하여 생성하는 기능을 제공합니다  
인터페이스의 유무에 따라서 JDK, CGLIB 프록시를 선택하여 생성해 줍니다  
이를 통해 생성 방법을 하나로 통일하여 코드 중복과 관리포인트를 줄일 수 있습니다  

---

## Factory Bean
먼저 ProxyFactoryBean을 알기전에 FactoryBean부터 살펴보겠습니다  

```kotlin

public interface FactoryBean<T> {

	String OBJECT_TYPE_ATTRIBUTE = "factoryBeanObjectType";

	@Nullable
	T getObject() throws Exception; -> bean 생성

	@Nullable
	Class<?> getObjectType(); -> FactoryBean으로 생성되는 객체의 class type

	default boolean isSingleton() { return true; }  -> bean 생성 객체의 싱글톤 여부

}

```

스프링이 사용하는 일반적인 객체는 new 연산자로 간당히 생성할 수 없을때가 있습니다  
DI(의존성 주입) 및 Bean으로 관리가 필요할 때가 그 이유입니다  
FactoryBean은 빈을 생성하는 팩토리역할을 제공하는 Interface입니다  

**FactoryBean을 통해 객체를 DI 및 Bean으로 사용할 수 있게 되며 IoC에 맞게 구현이 가능해 집니다**  


```kotlin 

public class ProxyFactoryBean extends ProxyCreatorSupport
		implements FactoryBean<Object>, BeanClassLoaderAware, BeanFactoryAware {
		
		......
		
	public Object getObject() throws BeansException {
		initializeAdvisorChain();
		if (isSingleton()) {
			return getSingletonInstance();
		}
		else {
			if (this.targetName == null) {
				logger.info("Using non-singleton proxies with singleton targets is often undesirable. " +
						"Enable prototype proxies by setting the 'targetName' property.");
			}
			return newPrototypeInstance();
		}
	}


	public Class<?> getObjectType() {
		synchronized (this) {
			if (this.singletonInstance != null) {
				return this.singletonInstance.getClass();
			}
		}
		Class<?>[] ifcs = getProxiedInterfaces();
		if (ifcs.length == 1) {
			return ifcs[0];
		}
		else if (ifcs.length > 1) {
			return createCompositeInterface(ifcs);
		}
		else if (this.targetName != null && this.beanFactory != null) {
			return this.beanFactory.getType(this.targetName);
		}
		else {
			return getTargetClass();
		}
	}
	
	
	public boolean isSingleton() {
		return this.singleton;
	}
		
		......
		
}


```

---

<br/>

## 관련 참고

[로키님 블로그](https://yejun-the-developer.tistory.com/7)  
[JiwonDev님 블로그](https://jiwondev.tistory.com/152)  
[Moon님 블로그](https://gmoon92.github.io/spring/aop/2019/02/23/spring-aop-proxy-bean.html)
[다비드박의 개발이야기 블로그](https://davidpark20.tistory.com/48)
[다비드박의 개발이야기 블로그](https://davidpark20.tistory.com/49)