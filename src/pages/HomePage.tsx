/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import FastStyleTransferModel from '../components/fastStyleTransferModel/FastStyleTransferModel'
import { Button, Card, Container, Grid } from '@mui/material'
import { makeStyles } from '@mui/styles'
import ImageSelector from '../components/imageSelector/ImageSelector'
import { useState, useRef } from 'react'
import ModeSelector from '../components/modeSelector/ModeSelector'
import AdditionalInfo from '../components/additionalInfo/AdditionalInfo'
import CameraDisplay from '../components/cameraDisplay/CameraDisplay'
import PhotoDisplay from '../components/photoDisplay/PhotoDisplay'
import styles from './home.module.css'
import { loadImage } from '../modules/utils'

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
  },

  card: {
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
  },
  cardGrid: {
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export enum CameraState {
  start,
  started,
  stop,
  stopped,
}

const HomePage = () => {
  enum Mode {
    video,
    photo,
  }
  const [state, setState] = useState<{
    camera: CameraState
    mode: string
    styleImage: string
    imageToStyle: string
  }>({
    camera: CameraState.stopped,
    mode: 'photo',
    styleImage: '/images/The_Great_Wave_off_Kanagawa.jpg',
    imageToStyle: '/images/turtle.jpg',
  })

  const startCamera = () => {
    setState({
      ...state,
      camera: CameraState.start,
    })
  }

  const stopCamera = () => {
    setState({
      ...state,
      camera: CameraState.stop,
    })
  }

  const updateCameraStateCallback = (cameraState: CameraState) => {
    setState({
      ...state,
      camera: cameraState,
    })
  }
  const updateStyleImageCallback = (styleImageUrl: string) => {
    //console.log("Updating image: " + styleImageElement);
    setState({
      ...state,
      styleImage: styleImageUrl,
    })
  }

  const updateImageToStyleCallback = (imageToStyle: string) => {
    //console.log("Updating image: " + styleImageElement);
    setState({
      ...state,
      imageToStyle: imageToStyle,
    })
  }

  const setModeToCallback = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    setState({
      ...state,
      mode: event.target.value,
    })
    console.log('event.target.value:' + event.target.value)
  }

  const predefinedStylesList = [
    {
      url: '/images/The_Great_Wave_off_Kanagawa.jpg',
      name: 'kanagawa_great_wave',
    },
    {
      url: '/images/Pillars_of_creation_2014_HST_WFC3-UVIS_full-res_denoised.jpg',
      name: 'hubble_pillars_of_creation',
    },
    {
      url: '/images/1024px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
      name: 'van_gogh_starry_night',
    },
    {
      url: '/images/JMW_Turner_-_Nantes_from_the_Ile_Feydeau.jpg',
      name: 'turner_nantes',
    },
    {
      url: '/images/Les_Demoiselles_d%27Avignon.jpg',
      name: 'picasso_demoiselles_avignon',
    },
    { url: '/images/Large_bonfire.jpg', name: 'fire' },
    {
      url: '/images/Derkovits_Gyula_Woman_head_1922.jpg',
      name: 'derkovits_woman_head',
    },
    {
      url: '/images/Untitled_%28Still_life%29_%281913%29_-_Amadeo_Souza-Cardoso_%281887-1918%29_%2817385824283%29.jpg',
      name: 'amadeo_style_life',
    },
    {
      url: '/images/Derkovits_Gyula_Talig%C3%A1s_1920.jpg',
      name: 'derkovtis_talig',
    },
  ]

  const predefinedImagesToStyle = [
    { url: '/images/turtle.jpg', name: 'turtle.jpg' },
  ]
  const classes = useStyles()

  return (
    <>
      <FastStyleTransferModel>
        {(doStyleTransfer) => {
          {
            const resizeAndStylizeImage = (
              imageToStyle: HTMLImageElement,
              styleImage: HTMLImageElement,
              imageCanvas: HTMLCanvasElement,
              targetCanvas: HTMLCanvasElement
            ) => {
              let imageCanvasCtx = imageCanvas.getContext('2d')
              let targetCanvasCtx = targetCanvas.getContext('2d')

              let imageAspectRatio = imageToStyle.height / imageToStyle.width
              imageCanvas.height = imageCanvas.width * imageAspectRatio
              console.log('New targetCanvas.height:' + imageCanvas.height)
              //const imgSize = Math.min(inputImage.width, inputImage.height);
              // The following two lines yield a central based cropping.
              // They can both be amended to be 0, if you wish it to be
              // a left based cropped image.
              //const left = (inputImage.width - imgSize) / 2;
              //const top = (inputImage.height - imgSize) / 2;
              //var left = 0; // If you wish left based cropping instead.
              //var top = 0; // If you wish left based cropping instead.
              if (imageCanvasCtx != null) {
                imageCanvasCtx.drawImage(
                  imageToStyle,
                  0,
                  0,
                  imageToStyle.width,
                  imageToStyle.height,
                  0,
                  0,
                  imageCanvas.width,
                  imageCanvas.height
                )
                let imageToStyleImgData = imageCanvasCtx.getImageData(
                  0,
                  0,
                  imageCanvas.width,
                  imageCanvas.height
                )
                doStyleTransfer(imageToStyleImgData, styleImage, targetCanvas)
              }
            }

            var stylizeImage = async () => {
              let canvas1 = document.querySelector(
                '#canvasContainer1'
              ) as HTMLCanvasElement
              let canvas2 = document.querySelector(
                '#canvasContainer2'
              ) as HTMLCanvasElement

              let styleImageP = loadImage(state.styleImage)
              let imageToStyleP = loadImage(state.imageToStyle)

              Promise.all([styleImageP, imageToStyleP])
                .then((images) => {
                  let styleImage = images[0]
                  let imageToStyle = images[1]
                  resizeAndStylizeImage(
                    imageToStyle,
                    styleImage,
                    canvas1,
                    canvas2
                  )
                })
                .catch((err) => console.error(err))
            }
          }
          return (
            <>
              <div>
                <div className={styles.container} key='dasboard'>
                  <div className={styles.inputFields}>
                    <div className={styles.imgWraper}>
                      <h3>Content Image</h3>
                      <Card>
                        {state.mode == 'photo' && (
                          <ImageSelector
                            listKey='imagesToStyle'
                            list={predefinedImagesToStyle}
                            uploadImageLabel='Upload Image'
                            setStateCallback={updateImageToStyleCallback}
                          />
                        )}
                      </Card>
                    </div>
                    <div className={styles.imgWraper}>
                      <h3>Style Image</h3>
                      <Card className={classes.card}>
                        <ImageSelector
                          listKey='styleImages'
                          list={predefinedStylesList}
                          uploadImageLabel='Upload Style'
                          setStateCallback={updateStyleImageCallback}
                        />
                      </Card>
                    </div>
                  </div>
                  <div className={styles.button}>
                    <Button
                      sx={{ width: '100%', mt: '20px' }}
                      variant='contained'
                      onClick={() => stylizeImage()}
                    >
                      GENERATE
                    </Button>
                  </div>
                  <div className={styles.result}>
                    {state.mode == 'camera' && (
                      <CameraDisplay
                        styleImageUrl={state.styleImage}
                        updateCameraStateCallback={updateCameraStateCallback}
                        cameraState={state.camera}
                        doStyleTransferCallback={doStyleTransfer}
                      />
                    )}
                    {state.mode == 'photo' && (
                      <PhotoDisplay
                        styleImageUrl={state.styleImage}
                        imageToStyleUrl={state.imageToStyle}
                        doStyleTransferCallback={doStyleTransfer}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* <Container className={classes.cardGrid} key="container">
                <Grid
                  container
                  spacing={{xs: 2, md: 3}}
                  columns={{xs: 12, sm: 12, md: 12}}
                  key="dasboard">
                  <Grid item xs={12} sm={4} md={4}>
                    <Card className={classes.card}>
                      <ImageSelector
                        listKey="styleImages"
                        list={predefinedStylesList}
                        uploadImageLabel="Upload Style"
                        setStateCallback={updateStyleImageCallback}
                      />
                      {state.mode == "photo" && (
                        <ImageSelector
                          listKey="imagesToStyle"
                          list={predefinedImagesToStyle}
                          uploadImageLabel="Upload Image"
                          setStateCallback={updateImageToStyleCallback}
                        />
                      )}

                      <Grid
                        container
                        rowSpacing={1}
                        alignItems="flex-start"
                        justifyContent="space-evenly"
                        p={2}>
                        <Grid item xs={12} md={12}>
                          <ModeSelector
                            mode={state.mode}
                            setModeToCallback={setModeToCallback}
                          />
                        </Grid>

                        {state.mode == "camera" && (
                          <Grid item xs={12} md={6}>
                            {state.camera != CameraState.start &&
                              state.camera != CameraState.started && (
                                <Button
                                  variant="outlined"
                                  onClick={startCamera}>
                                  Start Camera
                                </Button>
                              )}
                            {(state.camera == CameraState.start ||
                              state.camera == CameraState.started) && (
                              <Button variant="outlined" onClick={stopCamera}>
                                Stop Camera
                              </Button>
                            )}
                          </Grid>
                        )}

                        <AdditionalInfo />
                      </Grid>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={8}>
                    {state.mode == "camera" && (
                      <CameraDisplay
                        styleImageUrl={state.styleImage}
                        updateCameraStateCallback={updateCameraStateCallback}
                        cameraState={state.camera}
                        doStyleTransferCallback={doStyleTransfer}
                      />
                    )}
                    {state.mode == "photo" && (
                      <PhotoDisplay
                        styleImageUrl={state.styleImage}
                        imageToStyleUrl={state.imageToStyle}
                        doStyleTransferCallback={doStyleTransfer}
                      />
                    )}
                  </Grid>
                </Grid>
              </Container> */}
            </>
          )
        }}
      </FastStyleTransferModel>
    </>
  )
}

export default HomePage
