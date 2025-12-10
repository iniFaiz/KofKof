import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PopUpPage from '../src/components/PopUpPage.vue'

describe('PopUpPage', () => {
  it('renders properly when show is true', () => {
    const wrapper = mount(PopUpPage, { props: { show: true } })
    expect(wrapper.text()).toContain('Analyzing...')
  })

  it('does not render when show is false', () => {
    const wrapper = mount(PopUpPage, { props: { show: false } })
    expect(wrapper.find('div').exists()).toBe(false)
  })

  it('displays error message when error prop is provided', () => {
    const errorMsg = 'Network Error'
    const wrapper = mount(PopUpPage, { 
      props: { 
        show: true,
        error: errorMsg 
      } 
    })
    expect(wrapper.text()).toContain('Analysis Failed')
    expect(wrapper.text()).toContain(errorMsg)
  })

  it('displays results when result prop is provided', async () => {
    const result = { prediction: 'dry', confidence: '95.5' }
    const wrapper = mount(PopUpPage, { 
      props: { 
        show: true,
        result: result 
      } 
    })
    
    // Wait for watcher to process results
    await wrapper.vm.$nextTick()
    
    expect(wrapper.text()).toContain('Analysis Results')
    expect(wrapper.text()).toContain('Dry')
    expect(wrapper.text()).toContain('95.50%')
  })
})
