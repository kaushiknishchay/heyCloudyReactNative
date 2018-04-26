/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';
import { cardBgColor } from '../constants/colors';


export const Section = styled.View`
  background: ${cardBgColor};
  ${props => (props.flex ? `flex: ${props.flex}` : '')};
  padding: 30px 20px;
  elevation: 2;
  margin: 6px 8px;
  border-bottom-width: 1px;
  border-bottom-color: #ddd;
`;


export const SwitchWrap = styled.View`
  margin: 5px;
  elevation: 1;
  padding: 20px 15px;
  background-color: ${cardBgColor}
  flex-direction: row;
`;

export const SwitchText = styled.Text`
  font-size: 19px;
  flex: 1;
`;


export const TitleText = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: #222;
  padding-bottom: 5px;
  margin-bottom: 15px;
`;

export const SubText = styled.Text`
  font-size: 17px;
  margin: 5px 0;
  color: #555;
  line-height: 20px;
`;

export const BoldText = styled.Text`
  letter-spacing:0.4px;
  font-weight: bold;
  color: ${props => (props.color ? props.color : '#333')};
`;

