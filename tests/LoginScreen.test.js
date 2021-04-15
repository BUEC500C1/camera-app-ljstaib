//Luke Staib 2021 ljstaib@bu.edu
//Log In Testing

import React from 'react';
import renderer from 'react-test-renderer';

import LoginScreen from '../screens/LoginScreen';

describe('<LoginScreen />', () => {
  //Test if rendering is correct
  it('renders correctly', () => {
    const tree = renderer.create(<LoginScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
})
