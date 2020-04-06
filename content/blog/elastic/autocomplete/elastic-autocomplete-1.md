---
title: "[Elastic] 1. Elastic 자동완성 가이드 (Autocomplete Guide) - Prefix Queries"
date: 2020-04-04
category: 'Elastic'
---

*Elastic을 활용하여 다음 3가지 방법의 자동완성 서비스를 구현하는 기술을 다룹니다*   
*Elastic 7.x 버젼을 기준으로 진행합니다*   

1. Prefix Queries를 활용한 자동완성  
2. Index 색인을 통한 Search  
3. Completion Suggester를 활용한 자동완성  

해당 포스팅에서는 `Prefix Queries`를 활용한 가장 단순한 자동완성을 만드는 방법 소개합니다  

<br/>

---

## Prefix Query  
먼저 테스트 데이터를 준비해 줍니다  
Google에 스팀게임을 검색해서 나오는 자동완성을 가져왔습니다  

<br/>

<span class="code_header">Autocomplete Example Data</span> 
```json

POST _bulk
{"index":{"_index":"autocomplete_test_1","_id":"1"}}
{"word":"스팀게임"}
{"index":{"_index":"autocomplete_test_1","_id":"2"}}
{"name":"스팀게임 추천"}
{"index":{"_index":"autocomplete_test_1","_id":"3"}}
{"name":"스팀게임 추천 2019"}
{"index":{"_index":"autocomplete_test_1","_id":"4"}}
{"name":"스팀게임 환불"}
{"index":{"_index":"autocomplete_test_1","_id":"5"}}
{"name":"스팀게임 싸게"}
{"index":{"_index":"autocomplete_test_1","_id":"6"}}
{"name":"스팀게임 순위"}
{"index":{"_index":"autocomplete_test_1","_id":"7"}}
{"name":"스팀게임 추천 2020"}
{"index":{"_index":"autocomplete_test_1","_id":"8"}}
{"name":"스팀게임 환불하는법"}

```


