import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router'; // Ensure correct import from 'react-router-dom'
import { FILE, FOLDER } from '../../utils/constants';

import FileIcon from '../../assets/img/file.png';
import FolderIcon from '../../assets/img/folder.png';

import { Container, Logo, Img, Name } from './styles';
import Menu from '../Menu';
import FileInfo from '../FileInfo';

// Define the structure of an entry
interface Entry {
  type: string;
  name: string;
  path: string;
  size?: number;
  date?: string;
  creatorName?: string;
}

// Define the props for Icon component
interface IconProps {
  entry: Entry;
  deleteFn: () => void;
}

const Icon: React.FC<IconProps> = ({ entry, deleteFn }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [state, setState] = useState({
    visible: false,
    showInfo: false,
    style: {
      right: 0,
      left: 0,
    },
    prevStyle: {
      top: 0,
      left: 0,
    },
  });

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    if (!nodeRef.current || !nodeRef.current.contains(event.target as Node)) {
      setState((prev) => ({
        ...prev,
        visible: false,
        style: { right: 0, left: 0 },
      }));
      return;
    }

    const clickX = event.clientX;
    const clickY = event.clientY;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const rootW = nodeRef.current.offsetWidth;
    const rootH = nodeRef.current.offsetHeight;

    const right = screenW - clickX > rootW;
    const top = screenH - clickY > rootH;

    setState((prev) => ({
      ...prev,
      style: {
        left: right ? `${clickX + 5}px` : `${clickX - rootW - 5}px`,
        top: top ? `${clickY + 5}px` : `${clickY - rootH - 5}px`,
        right: 0,
      },
      visible: true,
      prevStyle: { top, left: right ? clickX + 5 : clickX - rootW - 5 },
    }));
  };

  const handleMouseLeave = (event: MouseEvent) => {
    if (!nodeRef.current || !nodeRef.current.contains(event.target as Node)) {
      setState((prev) => ({
        ...prev,
        visible: false,
        style: { right: 0, left: 0 },
      }));
    }
  };

  const handleDelete = () => {
    deleteFn();
  };

  const enterFolder = () => {
    if (entry.type === FOLDER) {
      navigate(entry.path);
    }
  };

  React.useEffect(() => {
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleMouseLeave);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleMouseLeave);
    };
  }, []);

  let ext = entry.name.split('.').filter((el) => el);
  ext = ext.length >= 2 ? ext[ext.length - 1] : '';

  return (
    <Container ref={nodeRef}>
      <Logo onClick={enterFolder}>
        <Img src={entry.type === FILE ? FileIcon : FolderIcon} />
        {entry.type === FILE && <span>{`.${ext}`}</span>}
      </Logo>
      <Name>{entry.name}</Name>
      {state.visible && (
        <Menu
          style={state.style}
          content={[
            {
              info: 'Open',
              onClick: () =>
                entry.type === FOLDER
                  ? navigate(entry.path)
                  : setState((prev) => ({ ...prev, showInfo: true })),
            },
            {
              info: 'Get Info',
              onClick: () =>
                setState((prev) => ({ ...prev, showInfo: true })),
            },
            {
              info: 'Delete',
              style: { color: 'red' },
              onClick: handleDelete,
            },
          ]}
        />
      )}
      {state.showInfo && (
        <FileInfo
          title="File Info"
          style={state.prevStyle}
          closeFn={() =>
            setState((prev) => ({ ...prev, showInfo: false }))
          }
          entry={{
            type: entry.type,
            name: entry.name,
            path: '/',
            ext,
            size: entry.size,
            date: entry.date,
            creatorName: entry.creatorName,
          }}
        />
      )}
    </Container>
  );
};

export default Icon;