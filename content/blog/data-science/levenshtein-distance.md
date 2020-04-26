---
title: "[DataScience] Levenshtein Distance (편집거리 알고리즘) - 문장 유사도 분석을 어떻게 하는가?"
date: 2020-04-22
category: 'Data Science'
---  
# Levenshtein Distance (편집거리 알고리즘)
`Levenshtein Distance`는 러시아의 과학자 [블라디미르 리벤슈테인](https://en.wikipedia.org/wiki/Vladimir_Levenshtein)가 고안한 알고리즘  

<br/>

## Levenshtein Distance이 무엇일까?  
오늘날 **언어학/데이터과학** 같이 폭 넓게 사용되고 있으며 **문장과 DNA 유사도 분석같은 곳에 사용되고 있습니다**  
레벤슈타인 알고리즘의 비교 이론은 간단합니다  

<br/>

`두 비교군의 삽입, 변경, 삭제에 대한 비용을 계산합니다`  

<br/>

이렇게 두 개의 비교군을 분석하여 연산되는 <span class='red_font'>비용이 높을 수록</span> 서로 다른겁니다  

<br/>

## Levenshtein Distance 살펴보기  
수식으로 확인 하면 다음과 같습니다  

![levenshtein-expression](./images/levenshtein-expression.png)  

굉장히 어려운거 같게 써놨지만 개념을 알고 보면 간단합니다  

<br/>

간단한 예제를 통해 비교에 대한 비용 계산을 살펴보겠습니다  

1. 유사도나 분석 할까요  
2. 얼마나 분석이 될까요  

**이 두개의 문장을 비교해 보겠습니다**  

<br/>

![levenshtein-ex](./images/levenshtein-ex.png)
<span class='img_caption'>Levenshtein Distance 비교</span>  

<br/>  

이렇게 비용을 계산하면 **5만큼 서로 다르다는 계산 결과가 나옵니다**  


<br/>

## Levenshtein Distance 알고리즘 방식   
그럼 이런 방법을 어떻게 알고리즘으로 구현할까요?  
방법은 텍스트를 한글자씩 비교해가면서 행렬의 형태로 모든 경우의 수를 계산합니다  

<br/>

**1. 행과 열로 각각의 비교군을 배치하고 숫자를 순서대로 입력해줍니다**    

![levenshtein-step1](./images/levenshtein-step1.png)
<span class='img_caption'>Levenshtein Distance Step 1</span>  

<br/>
<br/>

**2. 다음으로 한글자식 비교하며 삽입, 변경, 삭제 여부를 결정합니다**  
> 1. 글자가 서로 동일하면 대각선의 숫자를 가져온다  
> 2. 변경이 필요하면 대각선 수의 +1을 한다  
> 3. 삽입이 필요한 경우 위의 수에서 +1을 한다  
> 4. 삭제가 필요한 경우 왼쪽 수에서 +1을 한다  
> 5. 1 ~ 4까지의 숫자 중 가장 낮은 수를 입력한다   

![levenshtein-step2](./images/levenshtein-process1.png)
<span class='img_caption'>Levenshtein Distance Step 2</span>  

<br/>
<br/>

**3. 이렇게 모든 경우의 수를 반복하면 맨 마지막 수가 비용값이 된다**  

![levenshtein-step3](./images/levenshtein-process2.png)
<span class='img_caption'>Levenshtein Distance Step 3</span>  

<br/>
