import React from 'react';
import { render, screen } from '@testing-library/react';
import Flow from './components/Flow';

test('renders learn react link', () => {
  render(<Flow nodes={undefined} edges={undefined} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
