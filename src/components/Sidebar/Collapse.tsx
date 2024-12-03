import React, { useState } from 'react';
import { CollapseContainer } from './styles';

// Define the props interface for the Collapse component
interface CollapseProps {
  children: (visible: boolean, toggle: () => void) => React.ReactNode;
}

// Collapse functional component with props typed correctly
const Collapse: React.FC<CollapseProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <CollapseContainer>
      {children(visible, () => setVisible(!visible))}
    </CollapseContainer>
  );
}

export default Collapse;