import styled from 'styled-components';

// Define and export the styled components
export const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 44px 0 32px;
`;

export const Logo = styled.div`
  position: relative;
  font-family: Lato, sans-serif;
  & span {
    position: absolute;
    bottom: 7px;
    left: 4px;
    width: 96%;
    font-weight: bold;
    color: white;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export const Img = styled.img``;

export const Error = styled.div`
  color: red;
  font-size: 12px;
`;

export const Top = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Toggle = {
  Container: styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  `,
  Option: styled.div`
    cursor: pointer;
    padding: 10px;
    margin-right: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;

    &.selected {
      background-color: #d0d0d0;
      font-weight: bold;
    }
  `
};

export const Form = {
  Container: styled.form`
    display: flex;
    flex-direction: column;

    .formField {
      margin-bottom: 15px;

      .field {
        width: calc(100% - 20px);
        padding: 10px;
        border-radius: 5px;
        border: solid 1px #ccc;

        &:focus {
          border-color: #888;
        }
      }
    }
  `,
  Submit: styled.button`
    padding: 10px;
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    cursor: pointer;

    &.disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    
    &:hover:not(.disabled) {
      background-color: #0056b3;
    }
  `
};