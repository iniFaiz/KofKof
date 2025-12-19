import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import HomeView from '../src/views/HomeView.vue'

// Mock HomePage component
vi.mock('../src/components/HomePage.vue', () => ({
  default: { template: '<div class="mock-home-page"></div>' }
}))

describe('HomeView', () => {
  it('renders HomePage component', () => {
    const wrapper = mount(HomeView)
    expect(wrapper.find('.mock-home-page').exists()).toBe(true)
  })
})
