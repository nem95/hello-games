import React from 'react';
import { StyleSheet, ScrollView, FlatList, Text, View, AsyncStorage } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import { connect } from 'react-redux';

import client from './utils/client';
import { updateGames, lastGameSelected } from './actions/games';

const mapStateToProps = function(state) {
  return {
    games: state.games
  };
};

// Which action creators does it want to receive by props?
const mapDispatchToProps = function(dispatch) {
  return {
    onUpdate: (list) => dispatch(updateGames(list)),
    updateLastGame: (game) => dispatch(lastGameSelected(game)),
  };
};

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      games: null,
      lastGame: null,
      loading: true,
    };
  }

  async componentWillMount() {
    const { onUpdate } = this.props;
    const lastGame = this.getLastGame();

    console.log('last game', lastGame);

    AsyncStorage.getItem('GameList', (err, data) => {
      if (data === null || JSON.parse(data).length <= 0 ){
        const games = this.fetchGamesList();

        games.then(res => {
         console.log('home load : ', games);

          AsyncStorage.setItem('GameList', JSON.stringify(res));
          onUpdate(res);
        }).catch(err => err);
      } else {
        onUpdate(data);
      }
    });

    this.setState({
      lastGame,
      loading: false,
    });
  }

  async fetchGamesList() {
    try {
      const games = await client.get('/game/list');

      return games.data;
    } catch (error) {
      this.setState({ loading: true });
    }
  }

  getLastGame() {
    AsyncStorage.getItem('LastGame', (err, data) => {
      if (err) return null;

      if (data && data.length > 0) return data;
    });
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ({ item }) => (
    <ListItem
      title={item.name}
      leftAvatar={{
        source: item.avatar_url && { uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg' },
        title: item.name
      }}
      onPress={() => this.setLastgame(item)}
      titleStyle={styles.listItem}
      chevronColor="#d34848"
      chevron
    />
  )

  setLastgame(game) {
    const { navigation, updateLastGame } = this.props;

    updateLastGame(JSON.stringify(game));
    return navigation.navigate('Infos', { itemId: game.id })
  }

  render() {
    const { loading } = this.state;
    const { games, navigation } = this.props;

    console.log(games);

    return (
      <ScrollView buttonStyle={styles.container}>
        {games.lastGame && (
          <View>
            <Text style={styles.lastGame}>
              Last Selected Games
            </Text>

            <ListItem
              title={games.lastGame.name}
              leftAvatar={{
                source: games.lastGame.avatar_url && { uri: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg' },
                title: games.lastGame.name
              }}
              onPress={() => navigation.navigate('Infos', { itemId: games.lastGame.id }) }
              titleStyle={{color: '#ffcd60' }}
              containerStyle={styles.lastItem}
              chevronColor="#ffcd60"
              chevron
            />
          </View>
        )}
        <Text style={styles.title}>
          All Games
        </Text>

        {!loading && games && (
          <FlatList
            keyExtractor={this.keyExtractor}
            data={games.gameList}
            renderItem={this.renderItem}
            chevron
          />
        )}

        {loading && (
          <Button
            title="Loading button"
            loading
            type="clear"
            buttonStyle={styles.loader}
          />
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'red',
    alignItems: 'stretch',
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    color: '#ff8162',
    fontSize: 50,
    textAlign: 'center',
  },
  lastGame: {
    color: '#ff8162',
    fontSize: 25,
    textAlign: 'center',
  },
  listItem: {
    color: '#ff8162',
  },
  lastItem: {
    backgroundColor: '#FFF',
  },
  loader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreen);
