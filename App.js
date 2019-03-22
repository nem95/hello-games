import React from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import gameReducer from './reducers/index';

import HomeScreen from './Home';
import InfoScreen from './Infos';
import Initiator from './Initiator';

const store = createStore(gameReducer);

const AppNavigator = createStackNavigator({
  Home: { screen: HomeScreen },
  Infos: {
    screen: InfoScreen,
  }
});

let Navigation = createAppContainer(AppNavigator);

// Render the app container component with the provider around it
class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Initiator>
          <Navigation />
        </Initiator>
      </Provider>
    );
  }
}

export default App;
