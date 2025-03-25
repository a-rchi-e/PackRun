import { StyleSheet } from "react-native";

export default StyleSheet.create({
container: {
    width: '100%',
    height: 776,
    backgroundColor: 'lightgrey',
},
  userMessage: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: 'flex-end',
    maxWidth: '80%',
    marginRight: '2%',
    marginTop: 3
  },
  otherMessage: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    marginLeft: '2%',
    marginTop: 3
  },
  username: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'right',
    marginRight: '5%',
    marginTop: 10
  },
  othername: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: '5%',
    marginTop: 10
  },
  topdash: {
    width: '100%',
    height: 116,
    backgroundColor: '#f8f8f8',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 10
},
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
    dashtext: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Roboto',
}
});

