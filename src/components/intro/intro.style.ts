import styled from "styled-components";

export const IntroStyled = styled.section`
    display: flex;
    flex-direction: column-reverse;
    position: relative;
    width: 100%;
    min-height: 100svh;
    background: #213547;
`

export const Canvas = styled.canvas`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`