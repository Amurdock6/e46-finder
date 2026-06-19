import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

vi.mock('axios', () => ({
  default: {
    get: vi.fn((url) => Promise.resolve({
      status: 200,
      data: url.includes('/scrape')
        ? [{
          listingId: 'test-listing',
          car: 'Test E46',
          link: 'https://example.com/listing',
          price: '$10,000',
          picture: 'https://example.com/e46.jpg',
          timeLeftText: '3 days',
          site: 'Bring a Trailer',
        }]
        : [],
    })),
  },
}));

test('renders the landing page navigation', async () => {
  render(<App />);

  expect(await screen.findByText(/Test E46/i)).toBeInTheDocument();
  expect(screen.getAllByAltText(/E46 Logo/i).length).toBeGreaterThan(0);
});
