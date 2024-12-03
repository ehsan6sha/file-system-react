import React, { Fragment } from 'react';
import { useLocation, useNavigate } from 'react-router'; // Ensure correct import from 'react-router-dom'

import { FILE } from '../../utils/constants';
import Collapse from './Collapse';

import { LinkContainer, DropDownIcon, Line } from './styles';

// Define the structure of a file entry
interface FileEntry {
  type: string;
  path: string;
  name: string;
  children?: FileEntry[];
}

// Define the props for SideMenu component
interface SideMenuProps {
  fileStructure: FileEntry[] | null;
}

const SideMenu: React.FC<SideMenuProps> = ({ fileStructure }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handler = (children: FileEntry[] | undefined, value: number) => {
    let i = value + 1;
    return children && children.length > 0
      ? children.map((entry) => {
          if (entry.type === FILE) return null; // Use strict equality and return null for React components

          const flag = entry.children ? entry.children.length > 0 : false;

          if (!flag) {
            return (
              <LinkContainer
                key={entry.path}
                onClick={() => navigate(entry.path)}
                className={location.pathname === entry.path ? 'selected' : ''}
              >
                <div className="link" style={{ marginLeft: `${10 * i}px` }}>
                  {entry.name}
                </div>
              </LinkContainer>
            );
          }

          return (
            <Collapse index={i} key={entry.path}>
              {(visible, handleVisible) => (
                <Fragment>
                  <LinkContainer
                    className={
                      location.pathname === entry.path ? 'selected' : ''
                    }
                  >
                    <div
                      className="link"
                      style={{
                        marginLeft: `${10 * i}px`,
                        width: '100%',
                      }}
                      onClick={() => navigate(entry.path)}
                    >
                      {entry.name}
                    </div>
                    <div className="dropdown" onClick={() => handleVisible()}>
                      <DropDownIcon className={visible ? '' : 'clicked'} />
                    </div>
                  </LinkContainer>
                  <div style={{ position: 'relative' }}>
                    {visible ? handler(entry.children, i) : null}
                  </div>
                </Fragment>
              )}
            </Collapse>
          );
        })
      : null;
  };

  return <Fragment>{handler(fileStructure, 0)}</Fragment>;
};

export default SideMenu;