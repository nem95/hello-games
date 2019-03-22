import React from 'react';
import { StyleSheet, Text, View, Linking, AsyncStorage } from 'react-native';
import { Button, Card, Divider } from 'react-native-elements';
import { connect } from 'react-redux';

import client from './utils/client';
import { updateGameDetails } from './actions/games';

const mapStateToProps = function(state) {
  return {
    games: state.games
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    onUpdate: (details) => dispatch(updateGameDetails(details))
  };
};

class InfosScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  async componentWillMount() {
    const { onUpdate, navigation, games } = this.props;
    const itemId = navigation.getParam('itemId');
    const gamesInfos = games.games[itemId];

    if (gamesInfos && gamesInfos.players && gamesInfos.type) {
      this.setState({ loading: false });
    } else {
      this.fetchGameDetails().then(res => {
        onUpdate(JSON.stringify(res));
        this.setState({ loading: false });
      }).catch(err => err);
    }
    this.setState({ loading: false });
  }

  async fetchGameDetails() {
    const { navigation } = this.props;
    const itemId = navigation.getParam('itemId');

    console.log('Use API to GET details');

    try {
      const details = await client.get(`/game/details?game_id=${itemId}`);

      return details.data
    } catch (error) {
      this.setState({ loading: true });
    }
  }

  learnMore(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  render() {
    const { loading } = this.state;
    const { games, navigation } = this.props;
    const game_id = navigation.getParam('itemId');
    console.log('GAMES : ', games);
    const gamesInfos = games.games[game_id];

    return (
      <View style={styles.container}>
        {loading && (
          <Button
            title="Loading button"
            type="clear"
            loading
          />
        )}

        {gamesInfos && gamesInfos.players && (
          <View>
            <Card >
              <Text style={styles.title}>{gamesInfos.name}</Text>
            </Card>

            <View style={styles.infos}>
              <Text>
                Created in : &nbsp;
                {gamesInfos.year}
              </Text>
              <Text>
                Type : &nbsp;
                {gamesInfos.type}
              </Text>
              <Text>
                Number of players : &nbsp;
                {gamesInfos.players}
              </Text>
            </View>

            <Divider style={styles.divider} />

            <Text style={styles.description}>{gamesInfos.description_en}</Text>

            {gamesInfos.url && (
              <Button
                title={`Learn more about ${gamesInfos.name}`}
                onPress={() => this.learnMore(gamesInfos.url)}
                buttonStyle={styles.learnMorebutton}
              />
            )}
          </View>
        )}
      </View>
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
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: '#FFF',
  },
  divider: {
    marginVertical: 10,
    backgroundColor: '#d34848',
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ff8162',
  },
  infos: {
    marginVertical: 10,
  },
  description: {
    marginVertical: 10,
  },
  learnMorebutton: {
    marginTop: 20,
    backgroundColor: '#ff8162',
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InfosScreen);
