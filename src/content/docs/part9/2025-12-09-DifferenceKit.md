---
title: DifferenceKit
description: A reference page in my new Starlight docs site.
---

## difference(from:)

- [difference](https://developer.apple.com/documentation/swift/string/difference(from:))는  두 Collection 사이의 변경사항(삭제, 삽입)을 계산하는 메서드입니다.  
- `Element`가 `Equatable`를 준수할 때 사용할 수 있습니다.
```swift
func difference<C>(from other C) -> CollectionDifference<Self.Element> where C : BidirectionalCollrction, Self.Element == C.Element
```
<br/>

## Example
- arr1 -> arr2로 바뀌려면 무엇을 삭제하고 무엇을 추가해야 하는지 알려줍니다.
- TableView나 CollectionView의 reload를 효율적으로 처리할 수 있습니다.
- 시간 복잡도는 최악의 겨
```swift
let arr1 = [1, 2, 3, 4]
let arr2 = [1, 3, 4, 5]
let diff = arr2.difference(from: arr1)
// diff.removals → [ .remove(offset: 1, element: 2, associatedWith: nil) ]
// diff.insertions → [ .insert(offset: 3, element: 5, associatedWith: nil) ]
```

## Reference
- [Apple Developer Documentation](https://developer.apple.com/documentation/swift/string/difference(from:))