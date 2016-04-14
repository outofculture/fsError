import React, {
  AppRegistry,
  Component,
  StyleSheet,
  TouchableHighlight,
  Text,
  View
} from 'react-native';
import {connect, Provider} from 'react-redux'
import {createStore, applyMiddleware} from 'redux'
import createSagaMiddleware from 'redux-saga'
import {take, call, fork} from 'redux-saga/effects'
import {readDir, stat} from 'react-native-fs'

function * rootSaga () {
    while (true) {
	yield take('BOOM')
	yield fork(readBoom)
    }
}

function * readBoom () {
    try {
	console.log('readBoom: this one works just fine')
	yield call(readDir, '/storage/emulated/0/')
	console.log('readBoom: ready. set.')
	yield call(readDir, '/storage/emulated/')
	console.log('readBoom: ideally, this line of code is executed')
    } catch (err) {
	console.log('readBoom: why?!', err)
    }
}

const sagaMiddleware = createSagaMiddleware(rootSaga)

function configureStore (initialState = {}) {
    return createStore(
        (st) => st,
        initialState,
        applyMiddleware(
            sagaMiddleware
        )
    )
}

class fsError extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Error demo
        </Text>
        <Text style={styles.instructions}>
          To see error, press:
        </Text>
	<TouchableHighlight onPress={this.props.boom}>
	    <Text>Here</Text>
	</TouchableHighlight>
      </View>
    );
  }
}

const ConnectedFsError = connect(
    null,
    (dispatch) => {return {boom: () => dispatch({type: 'BOOM'})}}
)(fsError)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

const AppProvider = (Provider) => class extends Component {
    render () {
        return <Provider {...this.props} />
    }
}
const ProvidingAppProvider = AppProvider(Provider)

class RootComponent extends Component {
    render () {
	return <ProvidingAppProvider store={configureStore()}>
            <ConnectedFsError />
        </ProvidingAppProvider>
    }
}

AppRegistry.registerComponent('fsError', () => RootComponent);
