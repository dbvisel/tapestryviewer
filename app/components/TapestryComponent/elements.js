import styled from "styled-components";

export const HelpDiv = styled.div`
  --inset: 75px;
  position: fixed;
  box-sizing: border-box;
  left: var(--inset);
  top: var(--inset);
  width: calc(100% - calc(2 * var(--inset)));
  max-height: calc(100% - calc(2 * var(--inset)));
  overflow-y: scroll;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  border-radius: 10px;
  z-index: 999 !important;
  border: 2px solid white;
  cursor: pointer;
  user-select: none;
  & h2 {
    text-align: center;
  }
  & > div {
    display: flex;
    justify-content: space-around;
    margin-bottom: 24px;
  }
  & ul {
    margin: 24px 0;
    padding: 0;
  }
  & li {
    margin: 0;
    padding: 0;
    line-height: 30px;
    & > span,
    & > svg/ {
      margin-right: 8px;
    }
  }
`;
