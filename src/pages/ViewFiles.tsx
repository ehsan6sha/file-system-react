import React, { Component } from 'react';
import styled from 'styled-components';
import { Routes, Route, useLocation } from 'react-router'; // Correct import

import Navigation from '../components/Navigation';
import SearchBar from '../components/SearchBar';
import Grid from '../components/Grid';

// Define props for the ViewFiles component
interface ViewFilesProps {}

const ViewFiles: React.FC<ViewFilesProps> = () => {
  const location = useLocation();

  return (
    <Container>
      <TopBar>
        <Navigation />
        <SearchBar />
      </TopBar>
      <Routes>
        <Route path="*" element={<Grid location={location} />} />
      </Routes>
    </Container>
  );
};

export default ViewFiles;

const Container = styled.div`
  padding: 41px;
  margin-left: 320px;
  transition: margin-left 250ms ease-in;
  @media screen and (max-width: 768px) {
    margin-left: 0px;
    padding: 55px 15px 15px 15px;
  }
`;

const TopBar = styled.div`
  display: flex;
  @media screen and (max-width: 768px) {
    display: block;
  }
`;