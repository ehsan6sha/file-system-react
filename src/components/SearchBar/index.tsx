import React, { useState, useEffect, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useLocation } from 'react-router'; // Correct import

import { LOCAL } from '../../utils/constants';
import { showPathEntries } from '../../utils/fileSystem';

import MagnifyIcon from './MagnifyIcon';
import SearchResults from './SearchResults';
import Filter from './Filter';

import { Container, Line, Input } from './styles';

// Define the shape of the Redux state
interface RootState {
  fileSystem: Record<string, any>;
}

// Define the props for SearchBar component
type ReduxProps = ConnectedProps<typeof connector>;

const SearchBar: React.FC<ReduxProps> = ({ entry, fileSystem }) => {
  const [term, setTerm] = useState('');
  const [width, setWidth] = useState(0);
  const [mode, setMode] = useState(LOCAL);
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const { width } = getComputedStyle(ref.current);
      setWidth(parseFloat(width));
    }
  }, []);

  return (
    <Input placeholder="Search for anything" ref={ref}>
      <MagnifyIcon
        fill="#545B61"
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          left: 9,
          marginTop: 5,
        }}
        size={15}
      />
      <input
        placeholder="Search for Anything"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
      />
      {term.length > 0 && (
        <Container style={{ width }}>
          <Filter mode={mode} handleMode={setMode} />
          <Line />
          <SearchResults
            style={{ width }}
            term={term}
            isDraggable={false}
            data={
              mode === LOCAL ? entry : Object.values(fileSystem)
            }
            closeResult={() => setTerm('')}
          />
        </Container>
      )}
    </Input>
  );
};

// Map Redux state to component props
const mapStateToProps = (state: RootState) => {
  const path = window.location.pathname; // Use window.location instead of hooks here
  return {
    entry: showPathEntries(path, state.fileSystem),
    fileSystem: state.fileSystem,
  };
};

const connector = connect(mapStateToProps);

export default connector(SearchBar);