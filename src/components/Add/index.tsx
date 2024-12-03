import React, { Fragment, useState, memo } from 'react';
import styled from 'styled-components';
import CreateNew from '../CreateNew';

// Define the props interface for the Add component
interface AddProps {
  saveEntry: (value: any) => void; // Adjust 'any' to a more specific type if possible
}

const Add: React.FC<AddProps> = ({ saveEntry }) => {
  const [open, setOpen] = useState(false);

  return (
    <Fragment>
      <Container onClick={() => setOpen(true)}>+</Container>
      {open && (
        <CreateNew
          title="Create New"
          closeFn={() => setOpen(false)}
          addEntry={value => saveEntry(value)}
        />
      )}
    </Fragment>
  );
};

export default memo(Add);

const Container = styled.div`
  height: 109px;
  width: 96px;
  border: 3px dashed #dee0e4;
  display: flex;
  justify-content: center;
  border-radius: 8px;
  align-items: center;
  font-size: 30px;
  color: #dee0e4;
  margin: -6px 21px;
  cursor: copy;
`;