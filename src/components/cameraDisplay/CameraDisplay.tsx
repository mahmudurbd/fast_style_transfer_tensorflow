/* eslint-disable @typescript-eslint/no-unused-vars */
import {useEffect} from "react";
import {Card, Grid} from "@mui/material";

import {CameraState} from "../../pages/HomePage";
import {loadImage} from "../../modules/utils";

import styles from "./camera.module.css";

type Props = {
  styleImageUrl: string;
  updateCameraStateCallback: (cameraState: CameraState) => void;
  cameraState: CameraState;
  doStyleTransferCallback: (
    imageToStyle: ImageData,
    styleImage: HTMLImageElement,
    canvasDest: HTMLCanvasElement
  ) => void;
};

let video: HTMLVideoElement;
let styleImage: HTMLImageElement;

const CameraDisplay = ({
  styleImageUrl,
  updateCameraStateCallback,
  cameraState,
  doStyleTransferCallback,
}: Props) => {
  const computeFrame = () => {
    const canvas1 = document.querySelector(
      "#canvasContainer1"
    ) as HTMLCanvasElement;
    const canvasCtx1 = canvas1.getContext("2d");
    const canvas2 = document.querySelector(
      "#canvasContainer2"
    ) as HTMLCanvasElement;
    const canvasCtx2 = canvas2.getContext("2d");

    if (canvasCtx1) {
      canvasCtx1.drawImage(video, 0, 0, canvas1.width, canvas1.height);
      const frame = canvasCtx1.getImageData(
        0,
        0,
        canvas1.width,
        canvas1.height
      );

      doStyleTransferCallback(frame, styleImage, canvas2);
    } else {
      console.error("canvasCtx is null!!");
    }
  };

  const timerCallback = () => {
    computeFrame();
    setTimeout(() => {
      if (video.srcObject != null) {
        timerCallback();
      }
    }, 0);
  };

  const stopCamera = () => {
    const stream = video.srcObject as MediaStream;
    const tracks = stream.getTracks();

    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      track.stop();
    }

    video.srcObject = null;
    updateCameraStateCallback(CameraState.stopped);
  };

  const startCamera = () => {
    const canvas1 = document.querySelector(
      "#canvasContainer1"
    ) as HTMLCanvasElement;
    const canvasCtx1 = canvas1.getContext("2d");
    const canvas2 = document.querySelector(
      "#canvasContainer2"
    ) as HTMLCanvasElement;
    const canvasCtx2 = canvas2.getContext("2d");

    video = document.createElement("video") as HTMLVideoElement;
    video.autoplay = true;
    video.onplay = timerCallback;
    //video.width = canvas1.width;
    //video.height = canvas1.height;

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({video: {width: 480, height: 270}})
        .then(function (stream) {
          console.log("Setting stream");
          video.srcObject = stream;
          const streamWidth = stream.getVideoTracks()[0].getSettings().width;
          const streamHeight = stream.getVideoTracks()[0].getSettings().height;
          if (streamWidth) {
            canvas1.width = streamWidth;
            canvas2.width = canvas1.width;
          }
          if (streamHeight) {
            canvas1.height = streamHeight;
            canvas2.height = canvas1.height;
          }
          updateCameraStateCallback(CameraState.started);
          return video;
        })
        .catch(function (err0r) {
          console.log("Something went wrong!" + err0r);
        });
    }
  };

  useEffect(() => {
    if (cameraState == CameraState.start) {
      console.log("StyleImageUrl=" + styleImageUrl);
      loadImage(styleImageUrl).then((loadedImage: HTMLImageElement) => {
        console.log(
          "StyleImageUrl=" +
            styleImageUrl +
            " loaded successfully=" +
            loadedImage
        );
        styleImage = loadedImage;
        startCamera();
      });
    } else if (cameraState == CameraState.started) {
      console.log("StyleImageUrl=" + styleImageUrl);
      loadImage(styleImageUrl).then((loadedImage: HTMLImageElement) => {
        console.log(
          "StyleImageUrl=" +
            styleImageUrl +
            " loaded successfully=" +
            loadedImage
        );
        styleImage = loadedImage;
      });
    } else if (cameraState == CameraState.stop) {
      stopCamera();
    }
  });

  return (
    <>
      <Grid
        container
        spacing={{xs: 2, md: 3}}
        columns={{xs: 12, sm: 12, md: 12}}>
        <Grid key="canvasContainer1" item xs={12} sm={12} md={12}>
          <Card className={styles.card}>
            <canvas id="canvasContainer1" className={styles.canvasCamera} />
          </Card>
        </Grid>
        <Grid key="canvasContainer2" item xs={12} sm={12} md={12}>
          <Card className={styles.card}>
            <canvas id="canvasContainer2" className={styles.canvasCamera} />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default CameraDisplay;
