import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import App from '../src/App.vue'
import HomePage from '../src/components/HomePage.vue'
import WarningPopUpPage from '../src/components/WarningPopUpPage.vue'

// Mock child components to avoid complex setup in App test
vi.mock('../src/components/HomePage.vue', () => ({
  default: { template: '<div class="mock-home-page"></div>' }
}))

vi.mock('../src/components/WarningPopUpPage.vue', () => ({
  default: { template: '<div class="mock-warning-popup"></div>' }
}))

describe('App', () => {
  it('renders HomePage and WarningPopUpPage', () => {
    const wrapper = mount(App)
    
    expect(wrapper.find('.mock-home-page').exists()).toBe(true)
    expect(wrapper.find('.mock-warning-popup').exists()).toBe(true)
  })
})
