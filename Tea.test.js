import { render, screen } from '@testing-library/react';
import Tea from './Tea.jsx';

test('renders learn react link', () => {
    render(<Tea />);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInDocument();
});
