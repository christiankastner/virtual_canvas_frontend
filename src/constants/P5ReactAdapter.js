class P5ReactAdapter {

    // Frequency takes in either 'treble', 'bass', or 'mid' as strings and the frequencyMapping parameter is supposed to be assigned the corresponding frequency mapping to sync with the music
    static readFrequencyShapes(array, frequency, frequencyMapping, p5) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].frequency === frequency) {
                    // console.log(frequency)
                    P5ReactAdapter.readJsonShape(array[i], frequencyMapping, p5)
            }
        }
    }

    static readJsonShape(json, frequencyMapping, p) {
        p.push()
        if ('fill' in json) {
            p.fill(json.fill)
        } else {
            p.noFill()
        }

        if ('stroke' in json) {
            p.stroke(json.stroke)
        } else {
            p.noStroke()
        }

        //This will allow the shape to rotate around its own axis
        if ('rotate' in json) {
            p.rotate(json.rotate)
        } else {

        }

        const {width, height, amount, spin, orbit, type} = json.shape
        p.rotate(orbit * p.frameCount)
        switch (type) {
            case "rect":
                //This will allow the shape to rotate around its own axis
                for (let i = 0; i < amount; i++) {
                    p.push()
                        p.rotate((360/amount)*i)
                        p.push()
                            p.translate(frequencyMapping,frequencyMapping)
                            p.rotate(spin * p.frameCount)
                            p.rectMode(p.CENTER)
                            p.rect(0, 0, width, height)
                        p.pop()
                    p.pop()
                }
                break;
            case "ellipse":

                for (let i = 0; i < amount; i++) {
                    p.push()
                        p.rotate((360/amount)*i)
                        p.push()
                            p.translate(frequencyMapping,frequencyMapping)
                            p.rotate(spin * p.frameCount)
                            p.ellipseMode(p.CENTER)
                            p.ellipse(0, 0, width, height)
                        p.pop()
                    p.pop()
                }
                break;
            case "triangle":
                p.triangle()
                break;
            case "line":

                break;
            default:
        }
        p.pop()
    }
}

export default P5ReactAdapter