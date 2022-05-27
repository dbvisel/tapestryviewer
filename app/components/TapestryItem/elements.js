import styled from "styled-components";

export const CommentIcon = styled.span`
  width: 30px;
  height: 30px;
  position: absolute;
  right: -35px;
  top: 6px;
  fill: black;
  cursor: pointer;
  user-select: none;
  opacity: ${(props) => (props.comments ? 1 : 0.25)};
  transition: 0.25s;
  &:after {
    content: "${(props) => (props.comments ? props.comments : "")}";
    top: -30px;
    left: 35px;
    position: relative;
  }
  &:hover {
    opacity: 1;
  }
`;
