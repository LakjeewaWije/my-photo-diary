import { CameraView, CameraType, useCameraPermissions, FlashMode } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, Dimensions, ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Tab() {
  const cameraRef: any = useRef(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<FlashMode>('on');
  const [permission, requestPermission] = useCameraPermissions();
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState<string>('');
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  function toggleCameraFlash() {
    setFlash(current => (current === 'on' ? 'off' : 'on'));
  }

  const takePicture = () => {
    if (cameraRef.current) {
      const start = Date.now();

      cameraRef.current
        ?.takePictureAsync({
          skipProcessing: true,
        })
        .then((photoData: any) => {

          console.log(`Delay after takePictureAsync: ${Date.now() - start} ms`);
          setImage(photoData.uri)
          setModalVisible(true);
          console.log(photoData.uri);
        });
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} flash={flash} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <View style={styles.btnView}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <FontAwesome size={30} name="rotate-right" color={'gray'} />
            </TouchableOpacity>
          </View>
          <View style={styles.btnView}>
            <TouchableOpacity style={styles.button} onPress={takePicture}>
              <FontAwesome size={70} name="circle" color={'white'} />
            </TouchableOpacity>
          </View>
          <View style={styles.btnView}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFlash}>
              <FontAwesome size={35} name="flash" color={flash == 'on' ? 'yellow' : 'gray'} />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={[styles.centeredView,]}>
          <ImageBackground resizeMode="contain" source={{ uri: image }} style={[styles.modalView]}>
            <TouchableOpacity style={{ 
              position: 'absolute', top: '8%', left: '5%' ,
               backgroundColor: 'gray',
              padding: 10, borderRadius: 10 }}
              onPress={() => setModalVisible(!modalVisible)}>
              <FontAwesome size={30} name="close" color={'white'} />
            </TouchableOpacity>
            <TouchableOpacity style={{ 
              position: 'absolute', top: '8%', right: '5%' ,
               backgroundColor: 'gray',
              padding: 10, borderRadius: 10 }}
              onPress={() => setModalVisible(!modalVisible)}>
              <FontAwesome size={30} name="download" color={'white'} />
            </TouchableOpacity>
          </ImageBackground >
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    bottom: '5%'
    // margin: 64,
  },
  btnView: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  button: {
    padding: 5,
    // flex: 1,
    // alignSelf: 'flex-end',
    // alignItems: 'center',
    // backgroundColor: 'pink'
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }

});
