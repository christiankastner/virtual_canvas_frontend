import React from 'react';
import mojs from 'mo-js';
import { connect } from 'react-redux'
import folds from '../folds.mp3'
import p5 from 'p5';
import "p5/lib/addons/p5.sound";
import { API_WS_ROOT } from '../constants/index'
const actioncable = require("actioncable")

class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {
        this.myP5 = new p5 (this.sketch, this.myRef.current)
        this.cable = actioncable.createConsumer(API_WS_ROOT)
    }

    sketch = (p) => {
        let x = 100; 
        let y = 100;

        p.preload = () => {
            this.song = p.loadSound(folds)
        }
      
        p.setup = () => {
          p.createCanvas(600, 600);
      
          this.toggleBtn = p.createButton("Play / Pause")
      
          this.uploadBtn = p.createFileInput(p.uploaded)
      
          this.uploadBtn.addClass("upload-btn")
      
          this.toggleBtn.addClass("toggle-btn");
      
          this.toggleBtn.mousePressed(p.toggleAudio);

          this.canvasChannel = this.cable.subscriptions.create({
                channel: `PicturesChannel`, 
                id: this.props.paramsId
            },{
                connected: () => {
                    console.log("Connected!")
                },
                disconnected: () => console.log("pictureChannel disconnected"),
                received: data => {
                    if ('type' in data) {
                        this.props.dispatch(data)
                    } 
                    // else if ('draw' in data) {
                    //     p.newDrawing(data.draw.x, data.draw.y)
                    // } else {
                    //     this.handleRecievedBurst(data)
                    // } 
            }})

        };

        p.newDrawing = (x,y) => {
            p.noStroke()
            p.fill(244)
            p.ellipse(x, y, 5,5);
        }
      
        p.uploaded = file => {
          this.uploadLoading = true;
          this.uploadedAudio = p.loadSound(file.data, p.uploadedAudioPlay);
        }

        p.mouseDragged = () => {
            this.canvasChannel.send({
                canvas_id: this.props.paramsId,
                draw: {
                    x: p.mouseX,
                    y: p.mouseY
                }
            })
        }
      
        p.uploadedAudioPlay = (file) => {
          this.uploading = false;
      
          if (this.song.isPlaying()) {
            this.song.pause()
          }
      
          this.song = file
          this.song.play() 
        }
      
      p.toggleAudio = () => {
        if (this.song.isPlaying()) {
          this.song.pause();
        } else {
          this.song.play();
        }
      }
      
        p.draw = function() {
            p.noStroke()
            p.fill(255);
            p.rect(x,y,50,50);
        };
      }

    componentWillUnmount() {
        this.cable.disconnect()
        this.props.dispatch({type: "REMOVE_CANVAS"})
    }

    handleClick = e => {
        if (!!this.props.selectAnimation) {
            this.canvasChannel.send({
                canvas_id: this.props.paramsId,
                animation: {
                    id: this.props.selectAnimation.id,
                    tune : {
                        x: e.pageX,
                        y: e.pageY,
                    }
                }
            })
        }
    }

    handleRecievedBurst = response => {
        const { id, tune } = response.animation
    
        this.props.bursts.find(animation => animation.id === id).burst.tune(tune).replay()
    }

    render() {
        return (
            <div id="canvas-container" onClick={this.handleClick} ref={this.myRef}>
                {/* <Sketch setup={this.setup} draw={this.draw} /> */}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectAnimation: state.selectAnimation,
        bursts: state.canvasBursts > 0 ? state.canvasBursts.map(animation => {
            return {
                id: animation.id,
                burst: new mojs.Burst({
                    left: 0, top: 0,
                    count:   animation.count,
                    angle: {0: animation.angle},
                    radius: {[animation.radius_1]: animation.radius_2},
                    children: {
                        shape: animation.shape,
                        fill:    animation.color,
                        radius:     20,
                        strokeWidth: animation.stroke_width,
                        duration:   animation.duration || 2000
                    }
                })
            }
        }) : null
    }
}

export default connect(mapStateToProps)(Canvas)

