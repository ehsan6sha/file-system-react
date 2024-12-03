import React from 'react';
import { useNavigate, useLocation } from 'react-router';

import { Container, Path } from './styles';
import GoBack from './GoBack';

// Function to display the navigation path
const showPath = (path: string): React.ReactNode[] => {
  const pathArr = path.split('/').filter(p => p);
  const len = pathArr.length;
  const arr: React.ReactNode[] = [<span key={0}>{` root `}</span>];

  pathArr.forEach((p, index) => {
    if (index === len - 1) {
      arr.push(
        <span className="currentPath" key={index + 1}>
          / {p}
        </span>
      );
    } else {
      arr.push(<span key={index + 1}>{` / ${p} `}</span>);
    }
  });
  return arr;
};

// Function to go back one directory in the path
const goBack = (path: string): string => {
  let newPath = path.split('/');
  newPath.splice(newPath.length - 1, 1);
  return newPath.join('/');
};

// Navigation component
const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Container>
      <div
        style={{ marginTop: -2, cursor: 'pointer' }}
        onClick={() => {
          if (location.pathname !== '/') {
            navigate(goBack(location.pathname));
          }
        }}
      >
        <GoBack fill={location.pathname === '/' ? '#acb9c3' : '#545B61'} />
      </div>
      <Path>{showPath(location.pathname)}</Path>
    </Container>
  );
};

export default Navigation;