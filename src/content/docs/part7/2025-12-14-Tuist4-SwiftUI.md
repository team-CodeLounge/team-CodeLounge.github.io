---
title: Tuist4 SwiftUI(수정중)
description: A reference page in my new Starlight docs site.
---

## Tuist
Xcode 프로젝트를 직접 관리하지 않고 코드로 정의해서 자동 생성/최적화해주는 CLI 빌더 툴이다.

## 사용 이유
협업을 할 때 항상 마주하게 되는 문제 중 하나로 코드를 Merge하는 경우에 같은 공간에서 작업을 한 코드들이 충돌이 발생한다.  
이를 원천적으로 피하기 위해 사용한다.

## install
```bash
# 모든 tuist버전 보기
mise ls-remote tuist

# tuist4 설치
mise install tuist@4

# tuist4 사용 설정
mise use -g tuist@4

# mise shims 쉘에 적용(임시)
eval "$(mise activate zsh)"

# mise shims 쉘에 적용(영구)
vi ~/.zshrc
eval "$(mise activate zsh)" # 입력  후 저장
source ~/.zshrc         

# tuist4 프로젝트 한정 설정(선택)
mise use tuist@4 --path .

# 버전 확인
tuist version
```

## 프로젝트 초기화
```bash
# 프로젝트 초기화
tuist init

# 그레프 확인
tuist grah

# 설정 파일 열기 테스트 후 다시 닫기
tuist edit
```

## 모듈 만들기(SwiftUI)
```bash
# 폴더 생성
mkdir App 
mkdir Modules

# 메인 프로젝트를 App으로 이동 및 Project.swift수정
tuist edit

# 모듈 생성 샘플 3개
cd Modules
```















## 모듈 만들기(UIKit)
tuist4 부터 UIKit버전 생성이 사라졌으므로 이를 해결하기 위해 아래와 같이 진행
```bash
# 폴더 새성
cd Modules
mkdir HomeModule

# 기능 모듈 / 데모 앱 디렉터리 생성
mkdir -p HomeCore/{Sources,Resources,Tests}
mkdir -p HomeDemo/{Sources,Resources}

# 빈 파일 생성
touch HomeCore/Sources/HomeViewController.swift
touch HomeDemo/Sources/AppDelegate.swift
touch HomeDemo/Sources/SceneDelegate.swift

# 명령어 입력
tuist edit

# Project.swift에 입력
import ProjectDescription

let project = Project(
    name: "HomeModule",
    targets: [
        // 1) 기능 모듈
        .target(
            name: "HomeCore",
            destinations: .iOS,
            product: .framework,
            bundleId: "dev.tuist.home.core",
            sources: ["HomeCore/Sources/**"],
            resources: ["HomeCore/Resources/**"],
            dependencies: []
        ),
        
        // 2) 데모 앱 (실행용)
        .target(
            name: "HomeDemo",
            destinations: .iOS,
            product: .app,
            bundleId: "dev.tuist.home.demo",
            infoPlist: .extendingDefault(with: [
                // 메인 스토리보드 비활성화
                "UIMainStoryboardFile": "",
                // SceneDelegate 사용
                "UIApplicationSceneManifest": [
                    "UIApplicationSupportsMultipleScenes": false,
                    "UISceneConfigurations": [
                        "UIWindowSceneSessionRoleApplication": [
                            [
                                "UISceneDelegateClassName":
                                    "$(PRODUCT_MODULE_NAME).SceneDelegate"
                            ]
                        ]
                    ]
                ]
            ]),
            sources: ["HomeDemo/Sources/**"],
            resources: ["HomeDemo/Resources/**"],
            dependencies: [
                .target(name: "HomeCore")
            ]
        ),
        
        // 3) HomeCore 테스트
        .target(
            name: "HomeCoreTests",
            destinations: .iOS,
            product: .unitTests,
            bundleId: "dev.tuist.home.core.tests",
            infoPlist: .default,
            sources: ["HomeCore/Tests/**"],
            dependencies: [
                .target(name: "HomeCore")
            ]
        ),
    ]
)
```

1. 기능 모듈 코드
```bash
// HomeCore/Sources/HomeViewController.swift
import UIKit

public final class HomeViewController: UIViewController {

    public override func viewDidLoad() {
        super.viewDidLoad()
        view.backgroundColor = .systemBlue
    }
}
```

2. 데모 앱 코드
```bash
// HomeDemo/Sources/AppDelegate.swift
import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(
        _ application: UIApplication,
        configurationForConnecting connectingSceneSession: UISceneSession,
        options: UIScene.ConnectionOptions
    ) -> UISceneConfiguration {
        UISceneConfiguration(
            name: "Default Configuration",
            sessionRole: connectingSceneSession.role
        )
    }
}

// HomeDemo/Sources/SceneDelegate.swift
import UIKit
import HomeCore

final class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = scene as? UIWindowScene else { return }

        let window = UIWindow(windowScene: windowScene)
        window.rootViewController = HomeViewController()
        self.window = window
        window.makeKeyAndVisible()
    }
}
```

## 기존 폴더 구조 예시
```bash
.
├── Project.swift
├── Targets/
│   └── App/
│       ├── Sources/
│       ├── Resources/
│       └── Info.plist
└── Tuist/
    └── Config.swift
```

## Tuist 주요 명령어 정리
```bash
# 새 프로젝트 초기화
tuist init

# Tuist 설정용 Xcode 프로젝트 열기
tuist edit

# Xcode 프로젝트 생성
tuist generate

# SPM Dependencies 다운로드
tuist fetch

# 캐시 및 빌드 아티팩트 정리
tuist clean

# 의존성 그래프 시각화
tuist graph

# 의존성 그래프 시각화(Test 제외)
tuist graph -t
```

## Reference
- https://tuist.dev/ko
- https://docs.tuist.dev/ko/guides/quick-start/install-tuist
- https://github.com/tuist/tuist
- https://jinsangjin.tistory.com/169
- https://github.com/sendbird/sendbird-chat-sample-ios
- https://green1229.tistory.com/487
- https://kka7.tistory.com/482
- https://slaveshin.tistory.com/56
- https://www.onestorecorp.com/sv/techblog/2025-01-02/Tuist.html
- https://velog.io/@hrepay/iOS-Fastlane%EA%B3%BC-Tuist%EB%A1%9C-%EC%8B%A0%EA%B7%9C-%ED%8C%80%EC%9B%90%EB%8F%84-10%EB%B6%84-%EB%A7%8C%EC%97%90-%EA%B0%9C%EB%B0%9C-%ED%99%98%EA%B2%BD-%EC%84%B8%ED%8C%85-%EB%81%9D%EB%82%B4%EA%B8%B0
- https://velog.io/@gustjrghd/5%EB%B6%84-%EB%A7%8C%EC%97%90-%ED%81%B4%EB%A6%B0%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98-iOS-%EC%95%B1-%EB%A7%8C%EB%93%A4%EA%B8%B0-Tuist-Makefile-%EC%99%84%EC%A0%84-%EC%9E%90%EB%8F%99%ED%99%94-%EA%B0%80%EC%9D%B4%EB%93%9C-mj88gajx
- https://velog.io/@yonghun00/Tuist%EB%A1%9C-iOS-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%83%9D%EC%84%B1%ED%95%98%EB%8A%94-%EB%B2%95
- https://velog.io/@gustjrghd/Tuist-%EA%B8%B0%EC%B4%88%EB%B6%80%ED%84%B0-Deep-Dive
- https://github.com/Jeon0976/iOS-CleanArchitecture-Sample
- https://velog.io/@ddophi98/카카오뱅크-iOS-프로젝트의-모듈화-여정-Tuist를-활용한-모듈-아키텍처-설계-사례
- https://www.youtube.com/watch?v=9HywMpgf8Mk
- https://medium.com/29cm/modular-architecture-를-향한-여정-part-1-xcodegen-도입과-모듈화의-시작-19a7f7b6401a
- https://medium.com/29cm/ios-modular-architecture-를-향한-여정-part-2-프로젝트-모듈화-레거시와-공존하기-d63f5e454573
- https://medium.com/daangn/실험과-현지화에-흔들리지-않는-모바일-엔지니어링-3c648f2ac74



## APP
1. 아래 코드 적용
```bash
import ProjectDescription

let project = Project(
    name: "TuistApp",
    targets: [

        // 메인 앱
        .target(
            name: "TuistApp",
            destinations: .iOS,
            product: .app,
            bundleId: "dev.tuist.TuistApp",
            infoPlist: .extendingDefault(with: [

                // ✅ Storyboard 미사용
                "UIMainStoryboardFile": "",

                // ✅ SceneDelegate 사용
                "UIApplicationSceneManifest": [
                    "UIApplicationSupportsMultipleScenes": false,
                    "UISceneConfigurations": [
                        "UIWindowSceneSessionRoleApplication": [
                            [
                                "UISceneDelegateClassName":
                                    "$(PRODUCT_MODULE_NAME).SceneDelegate"
                            ]
                        ]
                    ]
                ],

                // (선택) Launch Screen
                "UILaunchScreen": [
                    "UIColorName": "",
                    "UIImageName": "",
                ],
            ]),
            sources: ["App/TuistApp/Sources/**"],
            resources: ["App/TuistApp/Resources/**"],
            dependencies: []
        ),

        // 테스트
        .target(
            name: "TuistAppTests",
            destinations: .iOS,
            product: .unitTests,
            bundleId: "dev.tuist.TuistAppTests",
            infoPlist: .default,
            sources: ["App/TuistApp/Tests/**"],
            dependencies: [
                .target(name: "TuistApp")
            ]
        ),
    ]
)
```

2. SwiftUI기본 코드 삭제
```bash
# SwiftUI App 진입점 삭제
rm -f App/TuistApp/Sources/*App.swift

# SwiftUI ContentView 삭제
rm -f App/TuistApp/Sources/ContentView.swift

# 메인 앱 UIKit 구조
mkdir -p App/TuistApp/Sources
mkdir -p App/TuistApp/Resources
mkdir -p App/TuistApp/Tests

# AppDelegate / SceneDelegate 생성
touch App/TuistApp/Sources/AppDelegate.swift
touch App/TuistApp/Sources/SceneDelegate.swift
```

## AppDepegate
```bash
import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(
        _ application: UIApplication,
        configurationForConnecting connectingSceneSession: UISceneSession,
        options: UIScene.ConnectionOptions
    ) -> UISceneConfiguration {

        UISceneConfiguration(
            name: "Default Configuration",
            sessionRole: connectingSceneSession.role
        )
    }
}
```

## SceneDelegate
```bash
import UIKit

final class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?

    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = scene as? UIWindowScene else { return }

        let window = UIWindow(windowScene: windowScene)
        let rootVC = UIViewController()
        rootVC.view.backgroundColor = .systemGreen

        window.rootViewController = rootVC
        self.window = window
        window.makeKeyAndVisible()
    }
}
```
