---
title: "[Elastic] 2. Elastic 자동완성 가이드 (Autocomplete Guide) - Index Search"
date: 2020-10-12
category: 'Elastic'
---

*Elastic을 활용하여 다음 3가지 방법의 자동완성 서비스를 구현하는 기술을 다룹니다*   
*Elastic 7.x 버젼을 기준으로 진행합니다*   

1. Prefix Queries를 활용한 자동완성  
2. Index 색인을 통한 Search  
3. Completion Suggester를 활용한 자동완성  

해당 포스팅에서는 앞서 소개한 [Prefix Queries](https://renuevo.github.io/elastic/autocomplete/elastic-autocomplete-1/)에서는 다룰수 없었던  
초성검색과 같은 보다 복잡한 자동완성을 해결할 수 있는 `Index Search`를 활용한 자동완성을 만드는 방법 소개합니다  

<br/>

---

## Example Data Setting  
먼저 테스트 데이터를 준비해 줍니다  
간단한 Index Mapping 정보를 작성합니다  

<span class="code_header">**Autocomplete Example Mapping**</span>  
```json

PUT autocomplete_test_2
{
  "settings": {
    "analysis": {
      "analyzer": {
        "autocomplete": {
          "tokenizer": "autocomplete",
          "filter": [
            "lowercase"
          ]
        },
        "autocomplete_search": {
          "tokenizer": "lowercase"
        }
      },
      "tokenizer": {
        "autocomplete": {
          "type": "edge_ngram",
          "min_gram": 2,
          "max_gram": 20,
          "token_chars": [
            "letter",
            "digit"
          ]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "word": {
        "type": "text",
        "analyzer": "autocomplete",
        "search_analyzer": "autocomplete_search"
      }
    }
  }
}

```
색인을 활용한 자동완성을 위해 커스텀한 형태소 분석을 추가해 줍니다  

<br/>

[Elastic에서 기본적으로 제공하는 Tokenizer reference](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-tokenizers.html)  
토큰을 끊는 기준을 Elastic에서 제공하는 edge\_ngram으로 작성했습니다  
`edge_ngram`은 자동완성과 아주 잘 맞는 Tokenizer 입니다  

<br/>

<span class="code_header">**Edge_ngram Tokenizer**</span>  
```json

  "tokenizer": {
    "autocomplete": {
      "type": "edge_ngram",
      "min_gram": 2,
      "max_gram": 20,
      "token_chars": [
        "letter",
        "digit"
      ]
    }
  }

```
edge\_ngram는 기본적으로 min\_gram과 max\_gram을 지정하게 되어있습니다  
글자수를 지정하는 단위로 위와 같이 설정할 경우 "2 Quick Foxes"를 `[ Qu, Qui, Quic, Quick, Fo, Fox, Foxe, Foxes ]` 다음과 같이 끊어 줍니다  
그래서 실제 검색하는 글자 타이핑에 맞게 알맞은 색인어들이 생성됩니다  

<br/>

token\_chars는 글자수에 포함될 형태의 단위로 위에는 문자와 숫자를 추가 하였습니다  
문자와 숫자를 제외한 다른 것들(공백, 줄바꿈등)은 새롭게 토큰을 시작하는 기준이 됩니다  

<br/>

자세한 설명은 [Elastic 공식 가이드](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-edgengram-tokenizer.html)에서 확인할 수 있습니다!!  

<br/>


---

<br/>

이제 기본 index 설정 개념을 알아봤으니 예제의 사용할 데이터를 생성하겠습니다  

<br/>

![coupang_autocomplete](./images/coupang_autocomplete.png)
<span class='img_caption'>Coupang Search</span>  

자동완성 샘플 데이터는 쿠팡에 **세트**를 검색해서 나오는 자동완성을 가져왔습니다  

<br/>

<span class="code_header">**Autocomplete Example Data**</span>  
```json

POST _bulk
{"index":{"_index":"autocomplete_test_2","_id":"1"}}
{"word":"추석 선물 세트"}
{"index":{"_index":"autocomplete_test_2","_id":"2"}}
{"word":"여성 트레이닝복 세트"}
{"index":{"_index":"autocomplete_test_2","_id":"3"}}
{"word":"김밥 재료 세트"}
{"index":{"_index":"autocomplete_test_2","_id":"4"}}
{"word":"여성 속옷 세트"}
{"index":{"_index":"autocomplete_test_2","_id":"5"}}
{"word":"선물 세트"}
{"index":{"_index":"autocomplete_test_2","_id":"6"}}
{"word":"설화수 세트"}
{"index":{"_index":"autocomplete_test_2","_id":"7"}}
{"word":"달고나 만들기 세트"}
{"index":{"_index":"autocomplete_test_2","_id":"8"}}
{"word":"무선 키보드마우스 세트"}


```

<br/>

<br/>