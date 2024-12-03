import React, { useState } from 'react';
import { Link } from 'react-router';
import { connect, ConnectedProps } from 'react-redux';
import reducers from  '../../reducers'; // Adjust the import according to your actual root reducer path
import SideMenu from './SideMenu';
import { generateTreeFromList } from '../../utils/fileSystem';

import { SideBarContainer, Root, ShowMenu } from './styles';

// Define the structure of a file node
interface FileNode {
  children?: FileNode[];
  // Add other properties if necessary
}

// Define the props for Sidebar component
type SidebarProps = ConnectedProps<typeof connector>;

const Sidebar: React.FC<SidebarProps> = ({ fileStructure }) => {
  const [toggle, setToggle] = useState(true);
  
  // Ensure children is always an array
  const children = fileStructure[0]?.children || [];

  return (
    <SideBarContainer toggle={toggle}>
      <ShowMenu onClick={() => setToggle(!toggle)} />
      <Link to="/" className="rootLink">
        <Root />
      </Link>
      <SideMenu fileStructure={children} />
    </SideBarContainer>
  );
};

// Map state to props
const mapStateToProps = (state: typeof reducers) => {
  const fileStructure = generateTreeFromList(state.fileSystem);
  return {
    fileStructure
  };
};

// Connect Redux state to Sidebar component
const connector = connect(mapStateToProps);

export default connector(Sidebar);