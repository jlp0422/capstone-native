/* eslint-disable */
import React from 'react';
import { View, Text, StyleSheet, Button, AsyncStorage } from 'react-native';
import socket from '../socket-client'
window.navigator.userAgent = "react-native";

class PregameCountdown extends React.Component {
  constructor() {
    super()
    this.state = {
      hours: '',
      minutes: '',
      seconds: '',
      bar_name: ''
    }
    this.countdown = this.countdown.bind(this)
  }

  componentDidMount() {
    let countdownTimer
    this.countdown()
    Promise.all([
      AsyncStorage.getItem('user'),
      AsyncStorage.getItem('bar_id'),
      AsyncStorage.getItem('team_name'),
      AsyncStorage.getItem('bar_name'),
      AsyncStorage.removeItem('score')
    ])
    .then(([ user, bar_id, team, bar_name ]) => {
      this.setState({ bar_name})
      // console.log('ASYNC STORAGE:', '\n', 'user: ', user, '\n', 'bar id: ', bar_id, '\n', 'team name: ', team)
    })
    socket.on('game started', () => {
      this.props.navigation.navigate('QuestionActive')
    })
  }

  componentWillUnmount() {
    clearTimeout(countdownTimer)
  }

  countdown() {
    const now = new Date().getTime()
    const gameStart = new Date('June 21, 2018 21:00:00').getTime()
    const t = gameStart - now
    const days = Math.floor((t / (1000 * 60 * 60 * 24)))
    const hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((t % (1000 * 60)) / 1000)
    this.setState({ hours, minutes, seconds })
    countdownTimer = setTimeout(() => this.countdown(), 1000);
  }

  render() {
    const { hours, minutes, seconds, bar_name } = this.state
    const { name } = this.props.navigation.state.params
    const noGame = hours * 1 > 0 || minutes * 1 > 5
    const timer = `${hours * 1 > 9 ? hours : `0${ hours }`}:${minutes * 1 > 9 ? minutes : `0${ minutes }`}:${seconds * 1 > 9 ? seconds : `0${ seconds }`}`
    return (
      <View style={ styles.container }>
        <Text style={ styles.h1 }>Team { name }</Text>
        <Text style={styles.h2}>You are connected to{'\n'}{bar_name}</Text>
        <Text style={ styles.h2 }>Game starts in{`\n`}{ timer }</Text>
        {/* would be not button in final version, but need a way to create the game when testing */}
        <Button title="Start game!" onPress={() => this.props.navigation.navigate('QuestionActive')} />
        <Text style={ styles.buttonCopy }>Game will automatically start at 9pm ET.</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: '#E7F1F5',
  },
  h1: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 80,
    paddingBottom: 20,
    color: '#27476E'
  },
  h2: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    color: '#27476E'
  },
  buttonCopy: {
    fontSize: 12,
    padding: 30,
    textAlign: 'center',
    color: '#27476E'
  }
})

export default PregameCountdown;
