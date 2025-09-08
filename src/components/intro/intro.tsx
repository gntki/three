import * as S from './intro.style.ts'
import {useLayoutEffect, useRef} from "react";
import {Controller} from "three/scenes/model.ts";


export const Intro = () => {
  const sceneRef = useRef<HTMLCanvasElement | null>(null);

  useLayoutEffect(() => {
    const size = {w: window?.innerWidth, h: window.innerHeight};

    if(sceneRef?.current)
      new Controller(sceneRef.current, size);
  }, [sceneRef.current, window]);

  return (
    <S.IntroStyled>
      <S.Canvas ref={sceneRef}/>
    </S.IntroStyled>
  )
}

export default Intro
