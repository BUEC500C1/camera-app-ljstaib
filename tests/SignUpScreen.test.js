//Luke Staib 2021 ljstaib@bu.edu
//Sign Up Testing

import React from 'react';
import renderer from 'react-test-renderer';

import SignUpScreen from '../screens/SignUpScreen';

describe('<SignUpScreen />', () => {
  //Test if rendering is correct
  it('renders correctly', () => {
    const tree = renderer.create(<SignUpScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
})
