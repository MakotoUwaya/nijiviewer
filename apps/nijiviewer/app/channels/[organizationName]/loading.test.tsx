import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Loading from './loading';

describe('Channels [organizationName] loading', () => {
  it('renders skeleton loading without crashing', () => {
    const { container } = render(<Loading />);
    expect(container).toBeInTheDocument();
  });
});
