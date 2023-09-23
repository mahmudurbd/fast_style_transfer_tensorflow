/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
// import * as tf from "@tensorflow/tfjs";
// import { Tensor3D, Tensor4D, } from '@tensorflow/tfjs';
import { makeStyles } from '@mui/styles'
// import Box from '@mui/material/Box';
// import Modal from '@mui/material/Modal';
// import CircularProgress from '@mui/material/CircularProgress';
import { Button, CardMedia, Grid, NativeSelect } from '@mui/material'
import Carousel from 'react-material-ui-carousel'

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
  },

  cardMedia: {},
})

type Props = {
  listKey: string
  list: { name: string; url: string }[]
  uploadImageLabel: string
  setStateCallback: (styleImage: string) => void
}

const ImageSelector = ({
  listKey,
  list,
  uploadImageLabel,
  setStateCallback,
}: Props) => {
  const [image, setImage] = useState(list[0].url as string)

  const uploadImage = (
    evt: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const tgt = evt.target as HTMLInputElement
    const files = tgt.files

    // FileReader support
    if (FileReader && files && files.length) {
      const fr = new FileReader()
      fr.onload = function () {
        //let targetCanvas = document.getElementById(evt.target.getAttribute("imgid"));
        //resizeAndSquareImage(fr.result, targetCanvas);
        console.log('key=' + listKey)
        const imagesList = document.getElementById(listKey) as HTMLSelectElement

        if (files && files[0] != null) {
          const option = document.createElement('option')
          option.text = files[0].name
          option.value = String(fr.result)
          imagesList.add(option, 0)
          imagesList.selectedIndex = 0
          imagesList.dispatchEvent(new Event('change', { bubbles: true }))
        }
      }
      fr.readAsDataURL(files[0])

      //doStyleTransfer();
    }
  }
  const classes = useStyles()

  const notifyImageLoaded = () => {
    setStateCallback(image)
  }

  const selectImage = (
    evt: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const value = evt.target.value as string
    console.log('Changing state:' + value)

    setImage(value)
  }

  const imageHandler = (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    const url = e.currentTarget.getAttribute('src') as string
    setImage(url)
  }

  return (
    <>
      <CardMedia
        id='image'
        className={classes.cardMedia}
        image={image}
        title='Style Image'
        component='img'
        onLoad={notifyImageLoaded}
        key='selectorImage'
        height={300}
      />
      <Grid
        container
        rowSpacing={1}
        alignItems='flex-start'
        justifyContent='space-evenly'
        p={2}
        key='selector'
      >
        <Grid item xs={12} md={6} key='uploadMedia'>
          <label htmlFor={listKey + '-upload-image'}>
            <input
              style={{ display: 'none' }}
              id={listKey + '-upload-image'}
              name={listKey + '-upload-image'}
              type='file'
              onChange={uploadImage}
            />

            <Button variant='outlined' component='span'>
              {uploadImageLabel}
            </Button>
          </label>
        </Grid>
        <Grid item xs={12} md={6} key='imageList'>
          <NativeSelect
            defaultValue={image}
            key='random1'
            inputProps={{
              name: 'image',
              id: listKey,
            }}
            onChange={selectImage}
          >
            {list.map((image, index) => {
              return (
                <option key={'imageOption' + index} value={image.url}>
                  {image.name}
                </option>
              )
            })}
          </NativeSelect>
        </Grid>

        <Grid
          item
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          xs={12}
          md={12}
          key='carousel'
          mt={2}
        >
          <Carousel
            sx={{ width: '120px', height: '70px' }}
            navButtonsProps={{
              // Change the colors and radius of the actual buttons. THIS STYLES BOTH BUTTONS
              style: {
                height: '20px',
                width: '0px',
              },
            }}
            navButtonsWrapperProps={{
              // Move the buttons to the bottom. Unsetting top here to override default style.
              style: {
                fontSize: '20px',
              },
            }}
            key='carousel'
            autoPlay={false}
            animation='slide'
            indicators={false}
            navButtonsAlwaysVisible={true}
          >
            {list.map((image, index) => {
              return (
                <img
                  width='100%'
                  height='100%'
                  key={'imageOption' + index}
                  src={image.url}
                  onClick={imageHandler}
                />
              )
            })}
          </Carousel>
        </Grid>
      </Grid>
    </>
  )
}

export default ImageSelector
