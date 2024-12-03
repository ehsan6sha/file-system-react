import React, { Fragment } from 'react';
import { useNavigate } from 'react-router';

import { FILE } from '../../utils/constants';
import FileIcon from '../../assets/img/file.png';
import FolderIcon from '../../assets/img/folder.png';

import { Result, NoResult, Img, Path } from './styles';

// Define the structure of a search result entry
interface SearchResultEntry {
  type: string;
  name: string;
  path: string;
  parentPath: string;
}

// Define the props for SearchResults component
interface SearchResultsProps {
  data: SearchResultEntry[];
  term: string;
  closeResult: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ data, term, closeResult }) => {
  const navigate = useNavigate();

  const handleClick = (arr: SearchResultEntry) => {
    const path = arr.type === FILE ? arr.parentPath : arr.path;
    navigate(path);
    closeResult();
  };

  const filteredData = data.filter(arr => arr.name.match(term) !== null);

  return (
    <Fragment>
      {filteredData.length > 0 ? (
        filteredData.map(arr => (
          <Result key={arr.path} onClick={() => handleClick(arr)}>
            <div>
              <Img src={arr.type === FILE ? FileIcon : FolderIcon} />
              {arr.name}
            </div>
            <Path>{arr.path}</Path>
          </Result>
        ))
      ) : (
        <NoResult>No Result</NoResult>
      )}
    </Fragment>
  );
};

export default SearchResults;