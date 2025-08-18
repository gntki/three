import * as S from './intro.style.ts'
import {useEffect, useRef} from "react";
import {controller} from "three/scenes/contoller.ts";


export const Intro = () => {
  const sceneRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if(!sceneRef.current) return;
    controller(sceneRef.current)
  }, [sceneRef.current]);

  return (
    <S.IntroStyled>
      <S.Canvas ref={sceneRef}/>
    </S.IntroStyled>
  )
}

export default Intro
