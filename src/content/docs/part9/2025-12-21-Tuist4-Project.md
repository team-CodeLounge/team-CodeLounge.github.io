---
title: Tuist4 실전 프로젝트 적용
description: A reference page in my new Starlight docs site.
---

## 프로젝트 생성
```bash
# 현재 디렉토리를 Tuist 프로젝트로 초기화
# - Project.swift, Tuist/Config.swift 등이 생성됨
tuist init

# Tuist 프로젝트 루트로 이동
cd 프로젝트

# tuist 편집(선택)
tuist edit

# Xcode 프로젝트(.xcodeproj) 생성
tuist generate
```

## 프로젝트 루트에 Workspace.swift생성
- Workspace는 여러 Project를 하나의 Xcode Workspace로 묶는 역할을 합니다.
- `Project.swift` -> 하나의 모듈(앱, 프레임워크 등)
- `Workspace.swift` -> 여러 Project를 묶는 컨테이너
- Xcode에서 .xcworkspace가 생성되는 구조입나다.
```swift
// Workspace.swift
import ProjectDescription

let workspace = Workspace(
    name: "SwiftUIApp",
    projects: [
        "Project/App",
        "Project/Feature/*"
    ]
)
```

## App 만들기 
```swift
// 기존 SwiftUIApp 디렉터리 전체 제거(Project/App폴더 내에 Package.swift로 직접 만들기 위함)

// 폴더 생성
mkdir Project
cd Project
mkdir App
mkdir Feature

// App 폴더 이동
cd App

// App 전용 Project.swift 생성
tuist edit, Project.swift 생성

// App/Project.wift
import ProjectDescription

let project = Project(
    name: "App",
    targets: [
        .target(
            name: "App",
            destinations: .iOS,
            product: .app,
            bundleId: "com.example.app",
            deploymentTargets: .iOS("17.0"),
            infoPlist: .extendingDefault(with: [
                "UILaunchScreen": [:]
            ]),
            sources: ["Sources/**"],
            resources: ["Resources/**"],
            dependencies: [
                // Feature 의존성은 나중에 추가
            ]
        )
    ]
)


// App 디렉토리에서 실제 폴더 밒 샘플 파일 생성
mkdir Sources
mkdir Resources
touch Sources/App.swift
touch Sources/ContentView.swift

// App 디렉토리에서 프로젝트 생성
tuist generate
```

## App 모듈 만들기(자동화)
- 기본적인 방법을 알아보았으니 이제 템플릿화를 해보겠습니다.
```swift
// Tuist/Templates/App/Sources
// App.stencil
import SwiftUI

@main
struct {{ name }}App: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

// Tuist/Templates/App/Sources
// ContentView.stencil
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Text("{{ name }} App")
        }
    }
}

// Tuist/Templates/App
// Project.stencil
import ProjectDescription

let project = Project(
    name: "{{ name }}",
    targets: [
        .target(
            name: "{{ name }}",
            destinations: .iOS,
            product: .app,
            bundleId: "com.example.{{ name | lowercase }}",
            deploymentTargets: .iOS("17.0"),
            infoPlist: .extendingDefault(with: [
                "UILaunchScreen": [:]
            ]),
            sources: ["Sources/**"],
            resources: ["Resources/**"],
            dependencies: [
                // Feature 의존성은 나중에 추가
            ]
        )
    ]
)

// Tuist/Templates/App
// App.swift

//
//  {{ name }}App.swift
//  {{ name }}
//
//  Created by {{ author }} on {{ now | date:"yyyy-MM-dd" }}.
//

import ProjectDescription

let appTemplate = Template(
    // 이 템플릿의 설명 (tuist scaffold 시 표시됨)
    description: "Creates an App module",
    
    // 사용자에게 입력받을 값들
    // 예: --name MyApp
    attributes: [
        .required("name")
    ],
    
    // 실제로 생성될 파일들 정의
    items: [
        // 1. Project.swift
        .file(
            // 생성될 파일 경로
            // 예: MyApp/Project.swift
            path: "{{ name }}/Project.swift",
            
            // 사용할 템플릿 파일
            // Tuist/Templates/App/Project.stencil
            templatePath: "Project.stencil"
        ),
        
        // 2. App엔트리 파일 생성
        .file(
            // 예: MyApp/Sources/MyAppApp.swift
            path: "{{ name }}/Sources/{{ name }}App.swift",
            templatePath: "Sources/App.stencil"
        ),
        
        // 3. ContentView 생성
        .file(
            // 예: MyApp/Sources/ContentView.swift
            path: "{{ name }}/Sources/ContentView.swift",
            templatePath: "Sources/ContentView.stencil"
        ),
        
        // 4 Xcode처럼 Assets.xcassets 통째로 복사해서 생성
        .directory(
            path: "{{ name }}/Resources/",
            sourcePath: "Assets.xcassets"
        )
    ]
)

// 실행법
tuist scaffold list
tuist scaffold App --name App
cd App
tuist generate
```

## 모듈 만들기
```swift
// 폴더 생성
mkdir Project
cd Project
mkdir App
mkdir Feature

// Feature 폴더 이동
cd Feature

// Auth 폴더 생성
mkdir Auth
cd Auth

// App 전용 Project.swift 생성
tuist edit, Project.swift 생성

// Package.swift
import ProjectDescription

let project = Project(
    name: "Auth",
    targets: [
        
        // MARK: - Feature Framework
        .target(
            name: "Auth",
            destinations: .iOS,
            product: .framework,
            bundleId: "com.example.auth",
            deploymentTargets: .iOS("17.0"),
            sources: ["Sources/**"],
            resources: ["Resources/**"],
            dependencies: [
                
            ]
        ),
    ]
)

mkdir Sources
mkdir Resources
touch Sources/App.swift
touch Sources/ContentView.swift

// 루트로 이동 후 프로젝트 생성
tuist generate
```





<!-- ## v3에서 사용하던 ProjectDescriptionHelpers를 사용
```swift

``` -->



<!-- ## Tuist란?
Xcode 프로젝트를 직접 관리하지 않고 코드로 정의해서 자동 생성/최적화해주는 CLI 빌더 툴입니다.  
기존 xcode에서 했던 targeet, spm, info, build-setting을 tuist로 관리할 수 있습니다.
- Project.swift 파일을 기반으로 프로젝트(.xcodeproj)파일을 생성해 줍니다.  
- 이 파일에 프로젝트의 설정값을 정의하면 프로젝트 생성 시 정의한 설정값으로 생성됩니다.
- 프로젝트의 설정값을 실수로 건드려 일어날 에러를 방지할 수 있습니다.

## 장점
1. xcodeproj파일이 없다.
    - 프로젝트를 커맨드 명령어로 그때그때 생성해 주기 때문에 github에 .xcodeproj 프로젝트를 올리지 않아도 됩니다.
    - 협업 시 프로젝트 파일경로에 관한 git 충돌을 회피할 수 있습니다.
2. 모듈화가 편리하다.
    - Project 파일을 생성하고 프로젝트와 타겟을 만들어 주는 메서드를 정의해 두면 모듈 생성 시 호출만 해서 사용하면 모듈 세팅이 금방 끝납니다.
3. 프로젝트의 의존관계를 파악하기 쉽다.
    - 의존된 모듈을 찾아가지 않아도 명령어로 이미지로 보기 쉽게 의존 그래프를 그려줍니다.
4. swift 언어로 모듈과 프로젝트 설정을 정의할 수 있다.
    - Tuist 모든 설정 파일을 정의할 때는 swift를 사용합니다.

## Tuist장점
1. 모듈화를 할 수 있습니다.
    - 모듈화를 하면 모듈별 의존성이 낮아지고 재활용성이 높아집니다.
    - 유지보수가 쉬워집니다.
    - 빌드 속도가 향상됩니다.

2. pbxproj 충돌을 출일 수 있습니다.
    - 협업하면서 많은 변경 사항을 merge 하는 과정에서   
    .pbxproj파일로 충돌을 줄일 수 있습니다.

## Tuist 설치
```bash
# Tuist 공식 문서
# https://docs.tuist.dev/en/
# https://docs.tuist.dev/en/guides/features/projects/directory-structure

# mise 설치
curl https://mise.run | sh

# mise 환경 활성화 (zsh 기준)
eval "$(mise activate zsh)" # 입력  후 저장
source ~/.zshrc  

# mise를 통해 Tuist 설치  
mise install tuist        # 최신 버전
mise use -g tuist@4.115.0 # 버전 명시
 
# Tuist4 버전을 전역으로 활성화
mise use -g tuist@4

# 설치 확인
tuist version

# 설치된 버전 확인
mise list tuist
```

## 프로젝트 설정
```bash
# 현재 디렉토리를 Tuist 프로젝트로 초기화
# - Project.swift, Tuist/Config.swift 등이 생성됨
tuist init

# Tuist 프로젝트 루트로 이동
cd 프로젝트

# Xcode 프로젝트(.xcodeproj) 생성
# --no-open 옵션:
#   - 생성 후 Xcode를 자동으로 열지 않음
#   - 터미널 작업을 이어서 할 때 유용
tuist generate --no-open

# Tuist 설정 파일 편집 모드 실행
# - Project.swift, Workspace.swift 등을
#   Xcode 자동완성/타입체크와 함께 수정
# - 앱 코드 수정용이 아님 (설정 전용)
tuist edit
```

## Project.swift 분석하기
```swift
// Project.swift
/**
 생성 결과물
 -  SwiftUIAPP.xcodeproj
 - SwiftUIAPP.xcworkspace
 */
let project = Project(
    name: "SwiftUIAPP",
    
    /**
     이 프로젝트에 포함될 타겟 목록
     → 여기서는 앱 타겟 1개 + 테스트 타겟 1개
     */
    targets: [
        // App
        .target(
            name: "SwiftUIAPP",
            destinations: .iOS,                 // 실행 가능한 플랫폼
            product: .app,                      // 빌드 결과물 타입 .framework / .staticFramework / .unitTests / uiTests
            bundleId: "dev.tuist.SwiftUIAPP",   // 앱의 고유 식별자
            infoPlist: .extendingDefault(       // 기본 Info.plist + 추가 설정
                with: [
                    /**
                     Launch Screen 설정
                     - SwiftUI에서는 보통 비워둬도 문제 없음
                     - 실제 화면은 LaunchScreen.storyboard 또는 SwiftUI splash로 처리
                     - 아예 필요 없으면 이렇게도 가능 infoPlist: .default
                     */
                    "UILaunchScreen": [
                        "UIColorName": "",
                        "UIImageName": "",
                    ],
                ]
            ),
            /**
             이 폴더들을 하나의 타겟 소스로 인식
             Tuist가 자동으로 Swift 파일 -> Sources
             Assets / json / images -> Resources
             */
            buildableFolders: [
                "SwiftUIAPP/Sources",
                "SwiftUIAPP/Resources",
            ],
            /**
             이 타겟이 의존하는 다른 타겟 / 프레임워크
             */
            dependencies: []
        ),
        // Test
        .target(
            name: "SwiftUIAPPTests",
            destinations: .iOS,
            product: .unitTests,
            bundleId: "dev.tuist.SwiftUIAPPTests",
            infoPlist: .default,
            buildableFolders: [
                "SwiftUIAPP/Tests"
            ],
            dependencies: [.target(name: "SwiftUIAPP")]
        ),
    ]
)
```

## Tuist 설치 및 활성화 스크립트
```bash
# bootstrap.sh
set -e

echo "=================================================================="
echo "Bootstrap Script"
echo "=================================================================="

# ...
# 해당 부분에 다양한 tool 설치 및 환경 설정 명령어가 존재합니다.
# ...

# mise 설치
if ! command -v mise &> /dev/null; then
  echo "\n[7] > Installing mise ...\n"
  curl https://mise.run | sh
else
  echo "mise is already installed."
fi

# mise 활성화
echo "\n[8] > Activating mise ...\n"
if ! grep -q 'eval "$(~/.local/bin/mise activate zsh)"' ~/.zshrc; then
  echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
else
  echo "mise is already activated in ~/.zshrc"
fi

echo "\n---------------------------------"
echo "::: Bootstrap Script Finished :::"
echo "---------------------------------\n"
```

## Reference
- [Blog](https://green1229.tistory.com/486)
- [ZUM](https://zuminternet.github.io/iOS-tuist-module/) -->