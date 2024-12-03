import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router'; // Correct import
import { connect, ConnectedProps } from 'react-redux';
import md5 from 'md5';

import SEO from '../../components/SEO';
import { showPathEntries } from '../../utils/fileSystem';
import { FOLDER } from '../../utils/constants';
import { addEntry, deleteEntry } from '../../actions/fileSystem';

import Icon from '../Icon';
import Add from '../Add';

import FolderIcon from '../../assets/img/folder.png';

// Define the shape of the Redux state
interface RootState {
  fileSystem: Record<string, any>;
}

// Map Redux state to component props
const mapStateToProps = (state: RootState, ownProps: { location: { pathname: string } }) => {
  const path = ownProps.location.pathname;
  return {
    entry: showPathEntries(path, state.fileSystem),
    fileSystem: state.fileSystem,
  };
};

// Connect Redux actions
const connector = connect(mapStateToProps, { addEntry, deleteEntry });

// Define props type using connected props
type PropsFromRedux = ConnectedProps<typeof connector>;

interface GridProps extends PropsFromRedux {
  location: { pathname: string };
}

const Grid: React.FC<GridProps> = ({ entry, fileSystem, addEntry, deleteEntry, location }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!Object.keys(fileSystem).includes(md5(location.pathname + FOLDER))) {
      navigate('/');
    }
  }, [fileSystem, location.pathname, navigate]);

  return (
    <Container>
      <SEO
        url={location.pathname}
        title={location.pathname}
        image={FolderIcon}
        description={location.pathname}
      />
      {entry.map((entryItem, index) => (
        <Icon
          entry={entryItem}
          index={index}
          key={`${entryItem.path}_${entryItem.type}`}
          deleteFn={() => {
            deleteEntry(md5(entryItem.path + entryItem.type));
          }}
        />
      ))}
      <Add
        saveEntry={(value) => {
          addEntry({
            ...value,
            parentID: md5(location.pathname + FOLDER),
            parentPath: location.pathname,
          });
        }}
      />
    </Container>
  );
};

export default connector(Grid);

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 40px 0;
`;