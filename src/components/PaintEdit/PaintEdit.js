import React, { useState } from 'react'
import "./PaintEdit.scss"
import { connect } from "react-redux"
import ColorPicker from "../ColorPicker/ColorPicker"
import { Slider } from "@material-ui/core"

const PaintEdit = props => {

    const [stroke, setStroke] = useState({
        red: props.myBrush.red,
        green: props.myBrush.green,
        blue: props.myBrush.blue,
        weight: props.myBrush.weight
    })

    const handleChange = (color,v) => {
        setStroke({
            ...stroke,
            [color]: v
        })
    }

    const handleSave = (e) => {
        e.preventDefault()
        props.dispatch({type: "BRUSH_EDIT", brush: stroke})
    }

    return (
        <div className="paint-controls">
            <form onSubmit={handleSave}>
                <button type="submit">Save Brush</button>
                <h3>Stroke Weight</h3>
                <Slider 
                    name="strokeWeight"
                    label="strokeWeight"
                    min={0}
                    max={10}
                    value={stroke.weight}
                    valueLabelDisplay='auto'
                    onChange={(e,v) => handleChange("weight", v)} />
                <h3>Stroke Color</h3>
                <ColorPicker red={stroke.red} blue={stroke.blue} green={stroke.green} handleChange={handleChange}/>
            </form>
        </div>
    )
}

export default connect()(PaintEdit)