/** 
 * Noise to Harmonic Sonification module
 * @module
 * @author Otto Hans-Martin Lutz <otto.lutz@fokus.fraunhofer.de>
 */
import { PWSon_Base } from './PWSon_Base.js'
import { PWSon_DroneSynth } from './PWSon_DroneSynth.js'
import 'https://cdnjs.cloudflare.com/ajax/libs/tone/13.8.25/Tone.js'
export { NoiseToHarmonic }

/**
 * Noise to Harmonic sonification class
 * @extends PWSon_Base
 */
class NoiseToHarmonic extends PWSon_Base {
    /** create a sonification object
    * @param {object=} audioOutput audio output object (if not Tone.Master)
    */
    constructor(audioOutput = null) {
        super(audioOutput)
        this.noiseSynth = new Tone.Noise()
        this.noiseVolume = new Tone.Volume(-27)
        this.harmonicSynth = new PWSon_DroneSynth()
        this.harmonicNoiseCrossfader = new Tone.CrossFade()
        this.noiseSynth.connect(this.noiseVolume)
        this.noiseVolume.connect(this.harmonicNoiseCrossfader, 0, 0)
        this.harmonicSynth.getOutput().connect(this.harmonicNoiseCrossfader, 0, 1)
        this.harmonicNoiseCrossfader.connect(this.volume)
    }

    /** initialize sonification */
    init() {
        super.init()
        this.harmonicNoiseCrossfader.fade.value = 0
        this.noiseSynth.start()
        this.harmonicSynth.play()
        this.reverb.wet.value = this.reverbWetAmountAfterGoodEnoughScore // with the noise to harmonic sonification, a little reverb is always used
    }

    /** update password sonification with new score
     * @param {number} score score, between 0 and 10
     * @param {numberCharacters=} numberCharacters number of characters typed (for gradual fade-in).
     */
    updateSonification(score, numberCharacters = this.lastNumberCharacters) {
        super.updateSonification(score, numberCharacters)
        this.harmonicNoiseCrossfader.fade.value = this.currentScore / 10.0
        this.applyGoodEnoughScore(score)
    }

    /**
     * Apply sound changes if the good enough score is passed
     * Overloading the method from PWSon_Base as we don't use the reverb here but a scale change
     * @param {number} score 
     */
    applyGoodEnoughScore(score) {
        if (score > this._goodEnoughThreshold) {
            this.harmonicSynth.enableMajorScale(true)
        }
        else {
            this.harmonicSynth.enableMajorScale(false)
        }
    }

}