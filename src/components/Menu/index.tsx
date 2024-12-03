import React from 'react';
import styled from 'styled-components';

// Define the structure of a content item
interface MenuItem {
  info: string;
  style?: React.CSSProperties;
  onClick: () => void;
}

// Define the props for the Menu component
interface MenuProps {
  style?: React.CSSProperties;
  content: MenuItem[];
}

const Menu: React.FC<MenuProps> = ({ style, content }) => {
  return (
    <Container style={style}>
      {content.map((c) => (
        <div key={c.info} className="content" style={c.style} onClick={c.onClick}>
          {c.info}
        </div>
      ))}
    </Container>
  );
};

export default Menu;

const Container = styled.div`
  position: absolute;
  background: white;
  width: 145px;
  z-index: 1000;
  border: 1px solid rgba(221, 224, 228, 0.5);
  box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.05);
  border-radius: 8px;

  & .content {
    padding: 15px;
    transition: background 250ms ease-in;

    &:hover {
      background: #eeeff1;
    }
  }
`;