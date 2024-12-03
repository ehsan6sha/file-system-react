import React, { Component, createRef, ComponentType, RefObject } from 'react';
import styled from 'styled-components';
import Icon from './Icon';

// Define the props interface for the HOC
interface ModalProps {
  title: string;
  closeFn: () => void;
  style?: React.CSSProperties;
  isDraggable?: boolean;
}

// Define the state interface for the Modal component
interface ModalState {
  isDragging: boolean;
  originalX: number;
  originalY: number;
  translateX: number;
  translateY: number;
  lastTranslateX: number;
  lastTranslateY: number;
}

// Higher-order component with TypeScript
const withModal = <P extends object>(WrappedComponent: ComponentType<P>) => {
  return class Modal extends Component<P & ModalProps, ModalState> {
    private _ref: RefObject<HTMLDivElement>;

    constructor(props: P & ModalProps) {
      super(props);
      this._ref = createRef();
      this.state = {
        isDragging: false,
        originalX: 0,
        originalY: 0,
        translateX: 0,
        translateY: 0,
        lastTranslateX: 0,
        lastTranslateY: 0,
      };
    }

    componentDidMount() {
      if (this._ref.current) {
        this._ref.current.addEventListener('mouseup', this.handleMouseUp);
      }
    }

    componentWillUnmount() {
      if (this._ref.current) {
        this._ref.current.removeEventListener('mousemove', this.handleMouseMove);
        this._ref.current.removeEventListener('mouseup', this.handleMouseUp);
      }
    }

    handleMouseDown = ({ clientX, clientY }: React.MouseEvent) => {
      if (!this.props.isDraggable) {
        return;
      }

      if (this._ref.current) {
        this._ref.current.addEventListener('mousemove', this.handleMouseMove);
        this._ref.current.addEventListener('mouseup', this.handleMouseUp);
      }

      this.setState({
        originalX: clientX,
        originalY: clientY,
        isDragging: true,
      });
    };

    handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
      const { isDragging } = this.state;
      if (!isDragging) {
        return;
      }

      this.setState((prevState) => ({
        translateX: clientX - prevState.originalX + prevState.lastTranslateX,
        translateY: clientY - prevState.originalY + prevState.lastTranslateY,
      }));
    };

    handleMouseUp = () => {
      if (this._ref.current) {
        this._ref.current.removeEventListener('mousemove', this.handleMouseMove);
        this._ref.current.removeEventListener('mouseup', this.handleMouseUp);
      }

      this.setState({
        originalX: 0,
        originalY: 0,
        lastTranslateX: this.state.translateX,
        lastTranslateY: this.state.translateY,
        isDragging: false,
      });
    };

    render() {
      const { translateX, translateY } = this.state;
      const style = this.props.style || {};
      
      return (
        <Container
          style={{
            ...style,
            transform: `translate(${translateX}px, ${translateY}px)`,
          }}
          onMouseDown={this.handleMouseDown}
          className="draggable"
          ref={this._ref}
        >
          <Heading>
            <Title>{this.props.title}</Title>
            <Close onClick={this.props.closeFn}>
              <Icon name="close" size={15} color="#82878B" />
            </Close>
          </Heading>

          <WrappedComponent {...(this.props as P)} />
        </Container>
      );
    }
  };
};

export default withModal;

const Container = styled.div`
  width: 316px;
  position: relative;
  z-index: 4000;
  padding: 20px 0 44px;
  background: #ffffff;
  border: 1px solid rgba(221, 224, 228, 0.7);
  box-shadow: 0 16px 64px 0 rgba(0, 0, 0, 0.08);
  border-radius: 8px;
`;

const Title = styled.div`
  font-family: Lato, sans-serif;
  font-size: 18px;
  color: #2f363f;
`;

const Heading = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Close = styled.div`
  position: absolute;
  top: 10px;
  right: 24px;
  padding: 13px;
  cursor: pointer;
`;