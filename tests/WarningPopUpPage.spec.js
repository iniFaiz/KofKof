import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import WarningPopUpPage from '../src/components/WarningPopUpPage.vue'

describe('WarningPopUpPage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders when disclaimer has not been accepted', async () => {
    const wrapper = mount(WarningPopUpPage)
    await wrapper.vm.$nextTick()
    expect(wrapper.find('h2').text()).toBe('Disclaimer')
    expect(wrapper.find('button').text()).toBe('I Understand')
  })

  it('does not render when disclaimer has been accepted', async () => {
    localStorage.setItem('disclaimerAccepted', 'true')
    const wrapper = mount(WarningPopUpPage)
    await wrapper.vm.$nextTick()
    // Since v-if is on the root element, the wrapper element itself might be a comment node or empty
    // But checking if the modal content exists is a safer bet
    expect(wrapper.find('h2').exists()).toBe(false)
  })

  it('sets localStorage and hides modal when button is clicked', async () => {
    localStorage.clear()
    const wrapper = mount(WarningPopUpPage)
    await wrapper.vm.$nextTick()
    
    const button = wrapper.find('button')
    await button.trigger('click')

    expect(localStorage.getItem('disclaimerAccepted')).toBe('true')
    expect(wrapper.find('h2').exists()).toBe(false)
  })
})
