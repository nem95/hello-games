import React from 'react';
import { StyleSheet, View, AppState, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';

import { updateGames, updateGameDetails, lastGameSelected } from './actions/games';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 10,
    paddingVertical: 0,
  }
});

const mapStateToProps = function(state) {
  return {
    games: state.games
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    onUpdate: (list) => dispatch(updateGames(list)),
    onUpdateDetails: (games) => dispatch(updateGameDetails(games)),
    updateLastGame: (game) => dispatch(lastGameSelected(game)),
  };
};

class Initiator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    // AsyncStorage.clear()
    const { updateLastGame } = this.props;
    const { appState } = this.state;

    if (appState === 'inactive' && nextAppState === 'active') {
      console.log('The user came back!', appState);
      this.fetchGamesFromStorage();
    }

    if (nextAppState.match(/inactive|background/)) {
      const { games } = this.props;

      this.saveGamesToStorage(games);
    }

    AsyncStorage.getItem('LastGame', (err, data) => {
      console.log('last storage games : ',data);
      if (err) return;

      if (data) {
        updateLastGame(data);
      }
    });
    this.setState({appState: nextAppState});
  };

  async saveGamesToStorage(games) {
    console.log('log games before quit : ', games);

    if (games.gameList && games.gameList.length > 0) {
      AsyncStorage.setItem('GameList', JSON.stringify(games.gameList));
    }

    if (games.games && Object.keys(games.games).length > 0) {
      AsyncStorage.setItem('Games', JSON.stringify(games.games));
    }

    console.log('last props games : ', games.lastGame);

    if (games.lastGame && Object.keys(games.games).length > 0) {
      AsyncStorage.setItem('LastGame', JSON.stringify(games.lastGame));
    }
  }

  async fetchGamesFromStorage() {
    const { onUpdate, onUpdateDetails } = this.props;
    AsyncStorage.getItem('GameList', (err, data) => {
      if (err) return;

      if (data && data.length > 0) {
        onUpdate(data);
      }
    });

    AsyncStorage.getItem('Games', (err, data) => {
      const gamesDetails = JSON.parse(data)

      Object.keys(gamesDetails).forEach(key => {
        if (gamesDetails[key] && Object.keys(gamesDetails[key]).length > 0) {
          onUpdateDetails(JSON.stringify(gamesDetails[key]));
        }
      });
    });
  }

  render() {
    const { children } = this.props;

    return (
      <View style={styles.container}>
        {children}
      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Initiator);
