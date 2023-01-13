(() => {
  let yOffset = 0; // page yOffset 대신 쓸 변수
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0; // 현재 활성화된(눈 앞에 보고있는) 씬(scroll-section)
  let enterNewScene = false; // 새로운 scene이 시작된 순간 true

  const sceneInfo = [
    {
      // 0
      type: "sticky",
      heihtNum: 5, // 브라우저 높이의 5배로 scrollHeight 세팅
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-0"),
        messageA: document.querySelector("#scroll-section-0 .main-message.a"),
        messageB: document.querySelector("#scroll-section-0 .main-message.b"),
        messageC: document.querySelector("#scroll-section-0 .main-message.c"),
        messageD: document.querySelector("#scroll-section-0 .main-message.d"),
      },
      values: {
        videoImageCount: 300,
        imageSequence: [0, 299],
        canvasOpacity: [1, 0, { start: 0.9, end: 1 }],
        messageAOpacityIn: [0, 1, { start: 0.1, end: 0.2 }],
        messageAOpacityOut: [1, 0, { start: 0.25, end: 0.3 }],
        messageATranslateYIn: [20, 0, { start: 0.1, end: 0.2 }],
        messageATranslateYOut: [0, -20, { start: 0.25, end: 0.3 }],
        messageBOpacityIn: [0, 1, { start: 0.3, end: 0.4 }],
        messageBOpacityOut: [1, 0, { start: 0.45, end: 0.5 }],
        messageBTranslateYIn: [20, 0, { start: 0.3, end: 0.4 }],
        messageBTranslateYOut: [0, -20, { start: 0.45, end: 0.5 }],
        messageCOpacityIn: [0, 1, { start: 0.5, end: 0.6 }],
        messageCOpacityOut: [1, 0, { start: 0.65, end: 0.7 }],
        messageCTranslateYIn: [20, 0, { start: 0.5, end: 0.6 }],
        messageCTranslateYOut: [0, -20, { start: 0.65, end: 0.7 }],
        messageDOpacityIn: [0, 1, { start: 0.7, end: 0.8 }],
        messageDOpacityOut: [1, 0, { start: 0.85, end: 0.9 }],
        messageDTranslateYIn: [20, 0, { start: 0.7, end: 0.8 }],
        messageDTranslateYOut: [0, -20, { start: 0.85, end: 0.9 }],
      },
    },
    {
      // 1
      type: "normal",
      // heightNum: 5, // type normal에서는 필요 없음
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-1"),
        content: document.querySelector("#scroll-section-1 .description"),
      },
    },
    {
      // 2
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-2"),
        messageA: document.querySelector("#scroll-section-2 .a"),
        messageB: document.querySelector("#scroll-section-2 .b"),
        messageC: document.querySelector("#scroll-section-2 .c"),
        pinB: document.querySelector("#scroll-section-2 .b .pin"),
        pinC: document.querySelector("#scroll-section-2 .c .pin"),
      },
      values: {
        messageATranslateYIn: [20, 0, { start: 0.15, end: 0.2 }],
        messageBTranslateYIn: [30, 0, { start: 0.5, end: 0.55 }],
        messageCTranslateYIn: [30, 0, { start: 0.72, end: 0.77 }],
        messageAOpacityIn: [0, 1, { start: 0.15, end: 0.2 }],
        messageBOpacityIn: [0, 1, { start: 0.5, end: 0.55 }],
        messageCOpacityIn: [0, 1, { start: 0.72, end: 0.77 }],
        messageATranslateYOut: [0, -20, { start: 0.3, end: 0.35 }],
        messageBTranslateYOut: [0, -20, { start: 0.58, end: 0.63 }],
        messageCTranslateYOut: [0, -20, { start: 0.85, end: 0.9 }],
        messageAOpacityOut: [1, 0, { start: 0.3, end: 0.35 }],
        messageBOpacityOut: [1, 0, { start: 0.58, end: 0.63 }],
        messageCOpacityOut: [1, 0, { start: 0.85, end: 0.9 }],
        pinBScaleY: [0.5, 1, { start: 0.5, end: 0.55 }],
        pinCScaleY: [0.5, 1, { start: 0.72, end: 0.77 }],
        pinBOpacityIn: [0, 1, { start: 0.5, end: 0.55 }],
        pinCOpacityIn: [0, 1, { start: 0.72, end: 0.77 }],
        pinBOpacityOut: [1, 0, { start: 0.58, end: 0.63 }],
        pinCOpacityOut: [1, 0, { start: 0.85, end: 0.9 }],
      },
    },
    {
      // 3
      type: "sticky",
      heightNum: 5,
      scrollHeight: 0,
      objs: {
        container: document.querySelector("#scroll-section-3"),
        canvasCaption: document.querySelector(".canvas-caption"),
      },
      values: {},
    },
  ];

  function setLayout() {
    // 각 스크롤 섹션의 높이 세팅
    for (let i = 0; i < sceneInfo.length; i++) {
      if (sceneInfo[i].type === "sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heihtNum * window.innerHeight;
      } else if (sceneInfo[i].type === "normal") {
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }

      sceneInfo[
        i
      ].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.pageYOffset;

    let totalScrollHeight = 0;
    for (let i = 0; i < sceneInfo.length; i++) {
      totalScrollHeight += sceneInfo[i].scrollHeight;

      if (totalScrollHeight >= yOffset) {
        currentScene = i;
        break;
      }
    }

    document.body.setAttribute("id", `show-scene-${currentScene}`);
    // console.log(sceneInfo);
  }

  function calcValues(values, currentYOffset) {
    let rv;
    // 현재 씬(스크롤섹션)에서 스크롤된 범위를 비율로 구하기
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    if (values.length === 3) {
      // start ~ end 사이에 애니메이션 실행
      const partScrollStart = values[2].start * scrollHeight;
      const partScrollEnd = values[2].end * scrollHeight;
      const partScrollHeight = partScrollEnd - partScrollStart;

      if (
        currentYOffset >= partScrollStart &&
        currentYOffset <= partScrollEnd
      ) {
        rv =
          ((currentYOffset - partScrollStart) / partScrollHeight) *
            (values[1] - values[0]) +
          values[0];
      } else if (currentYOffset < partScrollStart) {
        rv = values[0];
      } else if (currentYOffset > partScrollEnd) {
        rv = values[1];
      }
    } else {
      rv = scrollRatio * (values[1] - values[0]) + values[0];
    }

    return rv;
  }

  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset / scrollHeight;

    switch (currentScene) {
      case 0:
        if (scrollRatio <= 0.22) {
          // in
          objs.messageA.style.opacity = calcValues(
            values.messageAOpacityIn,
            currentYOffset,
          );
          objs.messageA.transform = `translate3d(0, ${calcValues(
            values.messageATranslateYIn,
            currentYOffset,
          )}%, 0)`;
        } else {
          // out
          objs.messageA.style.opacity = calcValues(
            values.messageAOpacityOut,
            currentYOffset,
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageATranslateYOut,
            currentYOffset,
          )}%, 0)`;
        }

        if (scrollRatio <= 0.42) {
          // in
          objs.messageB.style.opacity = calcValues(
            values.messageBOpacityIn,
            currentYOffset,
          );
          objs.messageB.transform = `translate3d(0, ${calcValues(
            values.messageBTranslateYIn,
            currentYOffset,
          )}%, 0)`;
        } else {
          // out
          objs.messageB.style.opacity = calcValues(
            values.messageBOpacityOut,
            currentYOffset,
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageBTranslateYOut,
            currentYOffset,
          )}%, 0)`;
        }

        if (scrollRatio <= 0.62) {
          // in
          objs.messageC.style.opacity = calcValues(
            values.messageCOpacityIn,
            currentYOffset,
          );
          objs.messageC.transform = `translate3d(0, ${calcValues(
            values.messageCTranslateYIn,
            currentYOffset,
          )}%, 0)`;
        } else {
          // out
          objs.messageC.style.opacity = calcValues(
            values.messageCOpacityOut,
            currentYOffset,
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageCTranslateYOut,
            currentYOffset,
          )}%, 0)`;
        }

        if (scrollRatio <= 0.82) {
          // in
          objs.messageD.style.opacity = calcValues(
            values.messageDOpacityIn,
            currentYOffset,
          );
          objs.messageD.transform = `translate3d(0, ${calcValues(
            values.messageDTranslateYIn,
            currentYOffset,
          )}%, 0)`;
        } else {
          // out
          objs.messageD.style.opacity = calcValues(
            values.messageDOpacityOut,
            currentYOffset,
          );
          objs.messageD.style.transform = `translate3d(0, ${calcValues(
            values.messageDTranslateYOut,
            currentYOffset,
          )}%, 0)`;
        }
        break;

      case 2:
        if (scrollRatio <= 0.25) {
          // in
          objs.messageA.style.opacity = calcValues(
            values.messageAOpacityIn,
            currentYOffset,
          );
          objs.messageA.transform = `translate3d(0, ${calcValues(
            values.messageATranslateYIn,
            currentYOffset,
          )}%, 0)`;
        } else {
          // out
          objs.messageA.style.opacity = calcValues(
            values.messageAOpacityOut,
            currentYOffset,
          );
          objs.messageA.style.transform = `translate3d(0, ${calcValues(
            values.messageATranslateYOut,
            currentYOffset,
          )}%, 0)`;
        }

        if (scrollRatio <= 0.57) {
          // in
          objs.messageB.style.opacity = calcValues(
            values.messageBOpacityIn,
            currentYOffset,
          );
          objs.messageB.transform = `translate3d(0, ${calcValues(
            values.messageBTranslateYIn,
            currentYOffset,
          )}%, 0)`;
        } else {
          // out
          objs.messageB.style.opacity = calcValues(
            values.messageBOpacityOut,
            currentYOffset,
          );
          objs.messageB.style.transform = `translate3d(0, ${calcValues(
            values.messageBTranslateYOut,
            currentYOffset,
          )}%, 0)`;
        }

        if (scrollRatio <= 0.83) {
          // in
          objs.messageC.style.opacity = calcValues(
            values.messageCOpacityIn,
            currentYOffset,
          );
          objs.messageC.transform = `translate3d(0, ${calcValues(
            values.messageCTranslateYIn,
            currentYOffset,
          )}%, 0)`;
        } else {
          // out
          objs.messageC.style.opacity = calcValues(
            values.messageCOpacityOut,
            currentYOffset,
          );
          objs.messageC.style.transform = `translate3d(0, ${calcValues(
            values.messageCTranslateYOut,
            currentYOffset,
          )}%, 0)`;
        }
        break;

      case 3:
        break;
    }
  }

  function scrollLoop() {
    enterNewScene = false;
    prevScrollHeight = 0;

    for (let i = 0; i < currentScene; i++) {
      prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    if (yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight) {
      enterNewScene = true;
      currentScene++;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (yOffset < prevScrollHeight) {
      enterNewScene = true;
      if (currentScene === 0) return; // 브라우저 바운스 효과로 인해 마이너스가 되는 것을 방지(모바일)
      currentScene--;
      document.body.setAttribute("id", `show-scene-${currentScene}`);
    }

    if (enterNewScene) return;

    playAnimation();
    // console.log("전체 스크롤 구간:", prevScrollHeight);
    // console.log("현재 활성화된 씬:", currentScene);
  }

  window.addEventListener("scroll", () => {
    yOffset = window.pageYOffset;
    scrollLoop();
    playAnimation();
  });

  window.addEventListener("DOMContentLoaded", setLayout);
  // window.addEventListener("load", setLayout);
  window.addEventListener("resize", setLayout);
})();
