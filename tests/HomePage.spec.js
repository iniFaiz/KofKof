import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import HomePage from '../src/components/HomePage.vue'

// Mock axios
vi.mock('axios')

describe('HomePage', () => {
  let wrapper

  beforeEach(() => {
    // Mock AudioContext
    window.AudioContext = vi.fn().mockImplementation(function() {
      return {
        createAnalyser: vi.fn().mockReturnValue({
          connect: vi.fn(),
          disconnect: vi.fn(),
          fftSize: 2048,
          smoothingTimeConstant: 0.8,
          frequencyBinCount: 1024,
          getByteFrequencyData: vi.fn()
        }),
        createMediaStreamSource: vi.fn().mockReturnValue({
          connect: vi.fn(),
          disconnect: vi.fn()
        }),
        close: vi.fn().mockResolvedValue()
      }
    })

    // Mock getUserMedia
    Object.defineProperty(global.navigator, 'mediaDevices', {
      value: {
        getUserMedia: vi.fn().mockResolvedValue({
          getTracks: () => [{ stop: vi.fn() }]
        })
      },
      writable: true
    })

    // Mock MediaRecorder
    window.MediaRecorder = class {
      constructor(stream) {
        this.stream = stream
        this.state = 'inactive'
        this.ondataavailable = null
        this.onstop = null
      }
      start() {
        this.state = 'recording'
      }
      stop() {
        this.state = 'inactive'
        if (this.onstop) this.onstop()
      }
    }

    // Mock requestAnimationFrame and cancelAnimationFrame
    window.requestAnimationFrame = vi.fn()
    window.cancelAnimationFrame = vi.fn()

    // Mock Canvas
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fillStyle: '',
      lineWidth: 0,
      strokeStyle: ''
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders properly', () => {
    wrapper = mount(HomePage)
    expect(wrapper.exists()).toBe(true)
    // Check for some static text or elements that should always be there
    // Since I don't have the full template, I'll assume there's a start button or similar
    // Based on the script, there is `isRecording` state.
  })

  it('initializes with correct default state', () => {
    wrapper = mount(HomePage)
    expect(wrapper.vm.isRecording).toBe(false)
    expect(wrapper.vm.recordingTime).toBe(10)
    expect(wrapper.vm.showCoughAnalysisPopup).toBe(false)
  })

  it('starts recording when start method is called', async () => {
    wrapper = mount(HomePage)
    
    // Trigger the startRecording method directly or via button click if we knew the selector
    // Since we don't have the full template, we'll call the method directly to test logic
    await wrapper.vm.startRecording()
    
    expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled()
    expect(window.AudioContext).toHaveBeenCalled()
    expect(wrapper.vm.isRecording).toBe(true)
  })

  it('stops recording correctly', async () => {
    wrapper = mount(HomePage)
    
    // First start it
    await wrapper.vm.startRecording()
    expect(wrapper.vm.isRecording).toBe(true)
    
    // Then stop it
    wrapper.vm.stopRecording()
    
    expect(wrapper.vm.isRecording).toBe(false)
    expect(wrapper.vm.showCoughAnalysisPopup).toBe(true)
  })
})
