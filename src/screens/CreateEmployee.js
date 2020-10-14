import React, {useState} from 'react';
import { StyleSheet, Text, View, Modal, Alert} from 'react-native';
import { TextInput, Button} from 'react-native-paper'; //same function as TextInput but with more predefined customizability.
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

const CreateEmployee = ({navigation, route}) => {
    const getDetails = (type) => {
        if(route.params){
            switch(type){
                case 'name':
                    return route.params.name;
                case 'phone':
                    return route.params.phone;
                case 'email':
                    return route.params.email;
                case 'salary':
                    return route.params.salary;
                case 'picture':
                    return route.params.picture;
                case 'position':
                    return route.params.position;
            }
        }
        else if(!route.params){
            return ''
        }
    }
    const [name, setName] = useState(getDetails('name'));
    const [phone, setPhone] = useState(getDetails('phone'));
    const [email, setEmail] = useState(getDetails('email'));
    const [salary, setSalary] = useState(getDetails('salary'));
    const [picture, setPicture] = useState(getDetails('picture'));
    const [position, setPosition] = useState(getDetails('position'));
    const [modal, setModal] = useState(false);
    
    const pickFromGallery = async () => {
        const {granted} = await Permissions.askAsync(Permissions.CAMERA_ROLL)
        if(granted){
            let data = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true, //lets us crop the image,
                aspect: [1, 1], //1:1 ratio (square picture)
                quality: 1 //full quality image,
            })
            // console.log(data)
            if(!data.cancelled){
                let newFile = { 
                    uri: data.uri,
                    type: `test/${data.uri.split('.')[1]}`, 
                    name: `test.${data.uri.split('.')[1]}`
                }
                handleUpload(newFile)
            }
        }
        else{
            Alert.alert('You need to authorize permission to camera.')
        }
    }

    const pickFromCamera = async () => {
        const {granted} = await Permissions.askAsync(Permissions.CAMERA)
        if(granted){
            let data = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true, 
                aspect: [1, 1], 
                quality: 1 
            })
            // console.log(data)
            if(!data.cancelled){
                let newFile = { 
                    uri: data.uri,
                    type: `test/${data.uri.split('.')[1]}`, 
                    name: `test.${data.uri.split('.')[1]}`
                }
                handleUpload(newFile)
            }
        }
        else{
            Alert.alert('You need to authorize permission to camera.')
        }
    }

    const handleUpload = (image) => { //handles Cloudinary
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'employeeApp')
        data.append('cloud_name', 'ephu1') 
        fetch('https://api.cloudinary.com/v1_1/ephu1/image/upload',{
            method: 'post',
            body: data
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            setPicture(data.url)
            setModal(false)
        })
        .catch(err =>{
            Alert.alert('Error while uploading')
        })
    }

    const submitData = () => { //http://10.0.2.2:3000 <- only works for android emulator
      //Note: I think if we want to move to production, we need to change localhost to remote host or cloud host like ngrok or heroku.
      //Follow up video: https://www.youtube.com/watch?v=FeeyS_P0kD4&list=PLB97yPrFwo5hMR8znwt0NqgmmqzoPemnT&index=22
      //ngrok looks like this: https://f7aa87ebf6ab.ngrok.io/send-data. Need to run ngrok http 3000 in cmd
      fetch("http://10.0.2.2:3000/send-data", { //https://stackoverflow.com/questions/9808560/why-do-we-use-10-0-2-2-to-connect-to-local-web-server-instead-of-using-computer
          method: "post",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              name: name,
              email: email,
              phone: phone,
              picture: picture,
              salary: salary,
              position: position
          })
      })
      .then(res => res.json())
      .then(data =>{
          Alert.alert(`${data.name} is saved!`)
          navigation.navigate('Home')
        //   console.log(data)
      })
      .catch(err =>{
        Alert.alert('Something went wrong')
    })
    }

    const updateData = () => { //handles when user presses the edit button
        fetch("http://10.0.2.2:3000/update", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: route.params._id,
                name: name,
                email: email,
                phone: phone,
                picture: picture,
                salary: salary,
                position: position
            })
        })
        .then(res => res.json())
        .then(data =>{
            Alert.alert(`${data.name} is updated!`)
            navigation.navigate('Home')
            //   console.log(data)
        })
        .catch(err =>{
            Alert.alert('Something went wrong')
        })
    }

    return (
        <View style={styles.root}>
                <TextInput //https://callstack.github.io/react-native-paper/text-input.html
                    label= 'Name'
                    style = {styles.inputStyle}
                    placeholder = 'Enter your name'
                    theme = {{colors: {primary: "#006aff"}}}
                    value = {name}
                    mode = 'outlined'
                    onChangeText={text => setName(text)}
                />
                <TextInput 
                    label= 'Phone'
                    style = {styles.inputStyle}
                    placeholder = 'Enter your phone number'
                    keyboardType = 'number-pad'
                    theme = {{colors: {primary: "#006aff"}}}
                    value = {phone}
                    mode = 'outlined'
                    onChangeText={text => setPhone(text)}
                />
                <TextInput 
                    label= 'Email'
                    style = {styles.inputStyle}
                    placeholder = 'Enter your email'
                    theme = {{colors: {primary: "#006aff"}}}
                    value = {email}
                    mode = 'outlined'
                    onChangeText={text => setEmail(text)}
                />
                <TextInput 
                    label= 'Salary'
                    style = {styles.inputStyle}
                    placeholder = 'Enter your salary'
                    theme = {{colors: {primary: "#006aff"}}}
                    value = {salary}
                    mode = 'outlined'
                    onChangeText={text => setSalary(text)}
                />
                <TextInput 
                    label= 'Position'
                    style = {styles.inputStyle}
                    placeholder = 'Enter your position'
                    theme = {{colors: {primary: "#006aff"}}}
                    value = {position}
                    mode = 'outlined'
                    onChangeText={text => setPosition(text)}
                />
                <Button onPress={() => setModal(true)} style = {{margin: 5}}icon= {picture == ''?"upload":'check'} mode="contained" theme = {picture == ''?{colors: {primary: "#006aff"}}: {colors: {primary: "green"}}}>
                    Upload image
                </Button>
                {route.params? //if route.params exist aka we pressed the edit button
                <Button onPress={() => updateData()} style = {{margin: 5}} icon="content-save" mode="contained" theme = {{colors: {primary: "#006aff"}}}>
                    update information
                </Button>
                ://else
                <Button onPress={() => submitData()} style = {{margin: 5}} icon="content-save" mode="contained" theme = {{colors: {primary: "#006aff"}}}>
                    save
                </Button>
                }

                <Modal
                    onRequestClose = {() => setModal(false)} //VERY USEFUL. Allows you to press the back button.
                    animationType = 'slide'
                    transparent = {true} //USEFUL: this dictates whether the modal is a popup or just a layer on top.
                    visible = {modal}
                >
                    <View style = {styles.modalView}>
                        <View style = {styles.modalButtonView}>
                            <Button onPress={() => pickFromCamera()} icon="camera" mode="contained" theme = {{colors: {primary: "#006aff"}}}>
                                Camera
                            </Button>
                            <Button onPress={() => pickFromGallery()} icon="image" mode="contained" theme = {{colors: {primary: "#006aff"}}}>
                                Gallery
                            </Button>
                            
                        </View>
                        <Button icon="cancel" onPress={() => setModal(false)} theme = {{colors: {primary: "#006aff"}}}>
                            Cancel
                        </Button>
                    </View>
                </Modal>
        </View>
    );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  inputStyle: {
    margin: 5
  },
  modalView: { //easy way to shove something at the bottom of a screen.
    position: 'absolute',
    bottom: 2,
    width: '100%',
    backgroundColor: 'white'
  },
  modalButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20
  }
});

export default CreateEmployee; 
