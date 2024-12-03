import React, { Component } from 'react';
import { FilterContainer } from './styles';

import { LOCAL, GLOBAL } from '../../utils/constants';

// Define the props interface for the Filter component
interface FilterProps {
  mode: string;
  handleMode: (mode: string) => void;
}

export default class Filter extends Component<FilterProps> {
  render() {
    return (
      <FilterContainer>
        Search:
        <FilterContainer.Options>
          <span
            className={this.props.mode === LOCAL ? 'selected' : ''}
            onClick={() => this.props.handleMode(LOCAL)}
          >
            Local
          </span>
          <span
            className={this.props.mode === GLOBAL ? 'selected' : ''}
            onClick={() => this.props.handleMode(GLOBAL)}
          >
            Global
          </span>
        </FilterContainer.Options>
      </FilterContainer>
    );
  }
}