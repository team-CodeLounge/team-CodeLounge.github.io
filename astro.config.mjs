// // @ts-check
// import { defineConfig } from 'astro/config';
// import starlight from '@astrojs/starlight';

// // https://astro.build/config
// export default defineConfig({
// 	integrations: [
// 		starlight({
// 			title: 'My Docs',
// 			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
// 			sidebar: [
// 				{
// 					label: 'Guides',
// 					items: [
// 						// Each item here is one entry in the navigation menu.
// 						{ label: 'Example Guide', slug: 'guides/example' },
// 					],
// 				},
// 				{
// 					label: 'Reference',
// 					autogenerate: { directory: 'reference' },
// 				},
// 			],
// 		}),
// 	],
// });


// @ts-check
// Astro의 TypeScript 검사 활성화. JS 파일에서도 TS 기반 진단을 지원함.
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// Expressive Code: 코드박스 줄번호 지원
// yarn add astro-expressive-code @expressive-code/plugin-line-numbers
// https://shiki.style/themes?utm_source=chatgpt.com
import astroExpressiveCode from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";

// https://astro.build/config
export default defineConfig({
  // 사이트의 절대 URL (GitHub Pages에서 필수)
  // GitHub Pages는 "https://{username}.github.io/{repository}/" 형태를 갖기 때문에 반드시 지정해야 함.
  site: "https://team-CodeLounge.github.io/",
  
  integrations: [
    // 📌 Expressive Code + 줄번호 플러그인 추가
    astroExpressiveCode({
      // themes: ["dracula"],        // 원하는 코드박스 테마
      // themes: ["one-dark-pro"],
      themes: ["github-dark"],

      plugins: [
        pluginLineNumbers(),      // ← 줄 번호 기능 활성화!
      ],
    }),

    // Starlight는 Astro 공식 문서 사이트 테마.
    // 사이드바 구성, 문서 레이아웃, 검색 등을 제공하는 문서 사이트 전용 통합 패키지.
    starlight({		
      // 문서 사이트의 전체 제목 (헤더 + 브라우저 탭 제목에 사용됨)
      title: 'Swift Docs',
      customCss: [
        './src/styles/custom.css',
      ],

      // 우측 상단에 표시될 소셜 링크 모음
      social: [
        {
          icon: 'github',               // GitHub 아이콘 표시
          label: 'GitHub',              // 접근성/툴팁 라벨
          href: 'https://github.com/team-CodeLounge/', // 링크 경로
        },
      ],

      // 좌측 사이드바 메뉴 구성
      sidebar: [
        {
          label: '1. 시작하기',              // 사이드바 섹션 제목
          // items: [
          //   // slug는 실제 문서 파일 위치와 연결됨
          //   // 예: src/content/docs/guides/example.md
          //   { label: 'Example Guide', slug: 'guides/example' },
          // ],
          autogenerate: { directory: 'part1' },
        },
        {
          label: '2. Swift 문법',           // Reference 섹션 제목
          
          // reference 디렉토리 내부의 문서를 자동으로 스캔하여 사이드바 구성
          // 파일을 새로 추가해도 자동으로 sidebar 항목 생성됨.
          autogenerate: { directory: 'part2' },
        },
        {
          label: '3. SwiftUI',           // Test 섹션 제목
          
          // reference 디렉토리 내부의 문서를 자동으로 스캔하여 사이드바 구성
          // 파일을 새로 추가해도 자동으로 sidebar 항목 생성됨.
          autogenerate: { directory: 'part3' },
        },
        {
          label: '4. UIKit',           // Test 섹션 제목
          
          // reference 디렉토리 내부의 문서를 자동으로 스캔하여 사이드바 구성
          // 파일을 새로 추가해도 자동으로 sidebar 항목 생성됨.
          autogenerate: { directory: 'part4' },
        },
        {
          label: '5. 테스트 및 디버깅',           // Test 섹션 제목
          
          // reference 디렉토리 내부의 문서를 자동으로 스캔하여 사이드바 구성
          // 파일을 새로 추가해도 자동으로 sidebar 항목 생성됨.
          autogenerate: { directory: 'part5' },
        },
        {
          label: '6. CI & CD',           // Test 섹션 제목
          
          // reference 디렉토리 내부의 문서를 자동으로 스캔하여 사이드바 구성
          // 파일을 새로 추가해도 자동으로 sidebar 항목 생성됨.
          autogenerate: { directory: 'part6' },
        },
        {
          label: '7. OpenSource',           // Test 섹션 제목
          
          // reference 디렉토리 내부의 문서를 자동으로 스캔하여 사이드바 구성
          // 파일을 새로 추가해도 자동으로 sidebar 항목 생성됨.
          autogenerate: { directory: 'part7' },
        },
        {
          label: '8. 디자인 패턴',           // Test 섹션 제목
          
          // reference 디렉토리 내부의 문서를 자동으로 스캔하여 사이드바 구성
          // 파일을 새로 추가해도 자동으로 sidebar 항목 생성됨.
          autogenerate: { directory: 'part8' },
        },
        {
          label: '9, Architecture',           // Test 섹션 제목
          
          // reference 디렉토리 내부의 문서를 자동으로 스캔하여 사이드바 구성
          // 파일을 새로 추가해도 자동으로 sidebar 항목 생성됨.
          autogenerate: { directory: 'part9' },
        },
        {
          label: '10. Backend',           // Test 섹션 제목
          
          // reference 디렉토리 내부의 문서를 자동으로 스캔하여 사이드바 구성
          // 파일을 새로 추가해도 자동으로 sidebar 항목 생성됨.
          autogenerate: { directory: 'part10' },
        },
      ],
    }),
  ],
});